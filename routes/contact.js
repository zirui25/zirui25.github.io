const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// 提交联系表单
router.post('/', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        
        // 发送邮件通知（可选）
        // await sendNotificationEmail(contact);
        
        res.status(201).json({ 
            success: true, 
            message: '提交成功，我们会尽快回复您',
            data: contact 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 获取所有联系记录（管理员）
router.get('/', async (req, res) => {
    try {
        const { status, limit = 20, page = 1 } = req.query;
        const query = {};
        
        if (status) query.status = status;
        
        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await Contact.countDocuments(query);
        
        res.json({
            success: true,
            data: contacts,
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

// 回复联系
router.post('/:id/reply', async (req, res) => {
    try {
        const { reply } = req.body;
        
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                status: 'completed',
                reply: reply,
                repliedAt: Date.now()
            },
            { new: true }
        );
        
        if (!contact) {
            return res.status(404).json({ success: false, message: '记录不存在' });
        }
        
        // 发送回复邮件
        // await sendReplyEmail(contact.email, reply);
        
        res.json({ 
            success: true, 
            message: '回复成功',
            data: contact 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;