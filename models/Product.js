const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['社交', '游戏', '金融', '云服务', '广告', '其他']
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '/images/default-product.png'
    },
    features: [{
        title: String,
        description: String
    }],
    downloadUrl: String,
    officialUrl: String,
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);