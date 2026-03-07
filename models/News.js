const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '/images/default-news.jpg'
    },
    category: {
        type: String,
        enum: ['公司新闻', '产品动态', '行业资讯', '社会责任'],
        default: '公司新闻'
    },
    author: {
        type: String,
        default: '腾讯集团'
    },
    views: {
        type: Number,
        default: 0
    },
    isHot: {
        type: Boolean,
        default: false
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('News', newsSchema);