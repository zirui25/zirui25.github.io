// 移动端导航菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    // 点击菜单按钮切换显示/隐藏
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        // 切换菜单图标（汉堡/叉号）
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // 点击导航链接后关闭移动端菜单
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.replace('fa-times', 'fa-bars');
        });
    });

    // 页面滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = '#fff';
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.backgroundColor = '#fff';
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
    });
});