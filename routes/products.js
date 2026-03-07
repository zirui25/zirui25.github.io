const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/products/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB限制
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|svg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('只支持图片文件'));
    }
});

// 获取所有产品
router.get('/', async (req, res) => {
    try {
        const { category, featured, limit = 10, page = 1 } = req.query;
        const query = {};
        
        if (category) query.category = category;
        if (featured) query.isFeatured = featured === 'true';
        
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await Product.countDocuments(query);
        
        res.json({
            success: true,
            data: products,
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

// 获取单个产品
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: '产品不存在' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 创建产品（管理员接口）
router.post('/', upload.single('icon'), async (req, res) => {
    try {
        const productData = req.body;
        if (req.file) {
            productData.icon = '/uploads/products/' + req.file.filename;
        }
        
        const product = new Product(productData);
        await product.save();
        
        res.status(201).json({ 
            success: true, 
            message: '产品创建成功',
            data: product 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 更新产品
router.put('/:id', upload.single('icon'), async (req, res) => {
    try {
        const productData = req.body;
        productData.updatedAt = Date.now();
        
        if (req.file) {
            productData.icon = '/uploads/products/' + req.file.filename;
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            productData,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({ success: false, message: '产品不存在' });
        }
        
        res.json({ 
            success: true, 
            message: '产品更新成功',
            data: product 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 删除产品
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: '产品不存在' });
        }
        res.json({ success: true, message: '产品删除成功' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;