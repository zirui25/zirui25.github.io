// 移动端导航菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
// 加载最新讯息（分页，默认5条）
loadLatestNews(1);

// 初始化浮动按钮事件
initFloatButtons();
    const navMenu = document.querySelector('.nav-menu');

    // 点击菜单按钮切换显示/隐藏
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // 点击导航链接后关闭移动端菜单
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // 页面滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // 加载产品数据
    loadProducts();
    
    // 加载新闻数据
    loadNews();
    
    // 处理联系表单提交
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Banner轮播
    initBannerSlider();
});

// 加载产品数据
async function loadProducts() {
    try {
        const response = await fetch('/api/products?limit=4');
        const data = await response.json();
        
        if (data.success) {
            const productsGrid = document.getElementById('productsGrid');
            if (productsGrid) {
                productsGrid.innerHTML = data.data.map(product => `
                    <div class="product-card">
                        <div class="product-icon">
                            <i class="fas fa-${getProductIcon(product.category)}"></i>
                        </div>
                        <h3>${product.name}</h3>
                        <p>${product.description.substring(0, 50)}...</p>
                        <a href="${product.officialUrl || '#'}" class="product-link">了解更多 <i class="fas fa-arrow-right"></i></a>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('加载产品失败:', error);
    }
}

// 加载新闻数据
async function loadNews() {
    try {
        const response = await fetch('/api/news?limit=4');
        const data = await response.json();
        
        if (data.success) {
            const newsGrid = document.getElementById('newsGrid');
            if (newsGrid) {
                newsGrid.innerHTML = data.data.map(news => `
                    <div class="news-card">
                        <div class="news-image">
                            <img src="${news.image}" alt="${news.title}">
                        </div>
                        <div class="news-content">
                            <span class="news-category">${news.category}</span>
                            <h3>${news.title}</h3>
                            <p>${news.summary}</p>
                            <div class="news-meta">
                                <span><i class="far fa-calendar"></i> ${formatDate(news.publishDate)}</span>
                                <span><i class="far fa-eye"></i> ${news.views}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('加载新闻失败:', error);
    }
}

// 初始化新闻列表的展开/折叠功能
function initNewsToggle() {
    const toggleBtn = document.getElementById('toggleNewsBtn');
    const newsList = document.getElementById('newsList');
    const viewMoreDiv = document.getElementById('newsViewMore');

    if (!toggleBtn || !newsList) return;

    // 移除之前可能绑定的监听器（避免重复）
    toggleBtn.replaceWith(toggleBtn.cloneNode(true));
    const newToggleBtn = document.getElementById('toggleNewsBtn');

    newToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // 切换展开类
        newsList.classList.toggle('expanded');

        // 更改按钮文字和图标
        const isExpanded = newsList.classList.contains('expanded');
        if (isExpanded) {
            newToggleBtn.innerHTML = '收起 <i class="fas fa-arrow-up"></i>';
            // 可选：展开后隐藏按钮（若希望一直显示则注释掉下面这行）
            // viewMoreDiv?.classList.add('hidden');
        } else {
            newToggleBtn.innerHTML = '显示更多 <i class="fas fa-arrow-down"></i>';
            // viewMoreDiv?.classList.remove('hidden');
        }
    });
}
/**
 * 新闻卡片模块 JS
 * 功能：点击卡片跳转（链接使用 # 占位，后续替换即可）
 * 如需动态渲染数据，可在此扩展
 */

(function() {
    'use strict';

    // 获取所有新闻卡片
    const cards = document.querySelectorAll('.news-card');

    // 为每个卡片绑定点击事件（如果已有 href 则使用，否则默认 #）
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '#';
            
            // 如果是 # 则阻止默认跳转，仅用于占位演示
            if (href === '#') {
                e.preventDefault();
                console.log('🔗 卡片点击（链接占位 #），可替换为实际文章地址');
                // 如果需要实际跳转，放开下行注释并设置真实链接
                // window.location.href = href;
            }
            // 真实链接会正常跳转
        });
    });

})();
// 处理联系表单提交
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('提交成功，我们会尽快回复您！');
            e.target.reset();
        } else {
            alert('提交失败：' + result.message);
        }
    } catch (error) {
        console.error('提交失败:', error);
        alert('提交失败，请稍后重试');
    }
}

// 初始化Banner轮播
function initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length || !dots.length) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // 自动轮播
    setInterval(nextSlide, 5000);
    
    // 点击点切换
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

// 辅助函数：获取产品图标
function getProductIcon(category) {
    const icons = {
        '社交': 'users',
        '游戏': 'gamepad',
        '金融': 'wallet',
        '云服务': 'cloud',
        '广告': 'chart-line',
        '其他': 'cube'
    };
    return icons[category] || 'cube';
}

// 辅助函数：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// 最新讯息分页相关变量
let latestPage = 1;
let loadingLatest = false;
let hasMoreLatest = true;

// 加载最新讯息（支持分页）
async function loadLatestNews(page = 1, append = false) {
    if (loadingLatest) return;
    loadingLatest = true;

    try {
        const limit = 5; // 每页5条
        const response = await fetch(`/api/news?limit=${limit}&page=${page}`);
        const data = await response.json();

        if (data.success) {
            const latestGrid = document.getElementById('latestGrid');
            if (!latestGrid) return;

            if (!append) {
                latestGrid.innerHTML = ''; // 首次加载清空
            }

            if (data.data.length === 0) {
                hasMoreLatest = false;
                document.getElementById('latestViewMore')?.classList.add('hidden');
                loadingLatest = false;
                return;
            }

            data.data.forEach(news => {
                const card = document.createElement('div');
                card.className = 'latest-card';

                // 格式化日期为 yyyy.m.d
                const date = new Date(news.publishDate);
                const formattedDate = `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`;

                // 图片背景：如果 news.image 存在则使用，否则用默认色
                const imageStyle = news.image ? `background-image: url('${news.image}');` : 'background: #ccc;';

                card.innerHTML = `
                    <div class="latest-card-image" style="${imageStyle} background-size: cover; background-position: center;">
                        <span class="card-date">${formattedDate}</span>
                    </div>
                    <div class="latest-card-content">
                        <h3>${news.title}</h3>
                        <p>${news.summary || news.content.substring(0, 60)}...</p>
                        <div class="latest-card-footer">
                            <a href="/news/${news._id}" class="btn-link">了解更多 <i class="fas fa-arrow-right"></i></a>
                            <span class="date-text">${formattedDate}</span>
                        </div>
                    </div>
                `;
                latestGrid.appendChild(card);
            });

            // 判断是否还有更多
            if (data.data.length < limit) {
                hasMoreLatest = false;
                document.getElementById('latestViewMore')?.classList.add('hidden');
            } else {
                hasMoreLatest = true;
                document.getElementById('latestViewMore')?.classList.remove('hidden');
            }

            latestPage = page;
        }
    } catch (error) {
        console.error('加载最新讯息失败:', error);
    } finally {
        loadingLatest = false;
    }
}

// “显示更多”按钮点击事件
document.getElementById('loadMoreLatestBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    if (hasMoreLatest && !loadingLatest) {
        loadLatestNews(latestPage + 1, true);
    }
});

// 初始化浮动按钮
function initFloatButtons() {
    const topBtn = document.getElementById('scrollToTop');
    const bottomBtn = document.getElementById('scrollToBottom');

    if (topBtn) {
        topBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    if (bottomBtn) {
        bottomBtn.addEventListener('click', function() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
}
