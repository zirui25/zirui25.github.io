const express = require('express');
const router = express.Router();
const News = require('../models/News');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/news/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('只支持图片文件'));
    }
});

// 获取新闻列表
router.get('/', async (req, res) => {
    try {
        const { category, hot, limit = 10, page = 1 } = req.query;
        const query = {};
        
        if (category) query.category = category;
        if (hot) query.isHot = hot === 'true';
        
        const news = await News.find(query)
            .sort({ publishDate: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await News.countDocuments(query);
        
        res.json({
            success: true,
            data: news,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 获取单条新闻
router.get('/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ success: false, message: '新闻不存在' });
        }
        
        // 增加浏览量
        news.views += 1;
        await news.save();
        
        res.json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 创建新闻
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const newsData = req.body;
        if (req.file) {
            newsData.image = '/uploads/news/' + req.file.filename;
        }
        
        const news = new News(newsData);
        await news.save();
        
        res.status(201).json({ 
            success: true, 
            message: '新闻发布成功',
            data: news 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 更新新闻
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const newsData = req.body;
        
        if (req.file) {
            newsData.image = '/uploads/news/' + req.file.filename;
        }
        
        const news = await News.findByIdAndUpdate(
            req.params.id,
            newsData,
            { new: true, runValidators: true }
        );
        
        if (!news) {
            return res.status(404).json({ success: false, message: '新闻不存在' });
        }
        
        res.json({ 
            success: true, 
            message: '新闻更新成功',
            data: news 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 删除新闻
router.delete('/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) {
            return res.status(404).json({ success: false, message: '新闻不存在' });
        }
        res.json({ success: true, message: '新闻删除成功' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;