// 等待 DOM 内容加载完毕后再执行脚本
document.addEventListener("DOMContentLoaded", () => {

    // --- 帮助函数：用于切换页面 ---
    function showPage(pageId) {
        // 隐藏所有 .page 元素
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示指定的 pageId
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) {
            pageToShow.classList.add('active');
        }
    }

    // --- 页面 1 (欢迎) -> 页面 2 (输入名字) ---
    const btnWelcomeEnter = document.getElementById('btn-welcome-enter');
    if (btnWelcomeEnter) {
        btnWelcomeEnter.addEventListener('click', () => {
            showPage('page-step1-name');
        });
    }

    // --- 页面 2 (输入名字) -> 页面 3 (选择模式) ---
    const btnNameConfirm = document.getElementById('btn-name-confirm');
    if (btnNameConfirm) {
        btnNameConfirm.addEventListener('click', () => {
            // 你可以在这里获取用户名: 
            // const username = document.getElementById('username-input').value;
            // console.log('Username:', username);
            showPage('page-step1-mode');
        });
    }

    // --- 页面 3 (选择模式) -> 页面 4 (选择Avatar) ---
    const modeSelectButtons = document.querySelectorAll('.btn-select-mode');
    modeSelectButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 你可以在这里区分用户选了哪个模式
            // console.log('Mode selected');
            showPage('page-step2-avatar');
        });
    });

    // --- 页面 4 (选择Avatar) 内部逻辑 ---
    
    // Tab 切换 (Girl/Boy)
    const avatarTabs = document.querySelectorAll('.avatar-tab');
    const avatarGrids = document.querySelectorAll('.avatar-grid');

    avatarTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有 Tab 的 'active' 状态
            avatarTabs.forEach(t => t.classList.remove('active'));
            // 给你点击的 Tab 添加 'active'
            tab.classList.add('active');

            // 隐藏所有的 grid
            avatarGrids.forEach(grid => grid.classList.remove('active'));
            // 显示对应的 grid
            const targetGridId = tab.dataset.target;
            const targetGrid = document.getElementById(targetGridId);
            if (targetGrid) {
                targetGrid.classList.add('active');
            }
        });
    });

    // Avatar 选择高亮
    const avatarItems = document.querySelectorAll('.avatar-item');
    avatarItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有 'selected' 状态
            avatarItems.forEach(i => i.classList.remove('selected'));
            // 给点击的 item 添加 'selected'
            item.classList.add('selected');
        });
    });

    // --- 页面 4 (选择Avatar) -> 页面 5 (选择心情) ---
    const btnAvatarConfirm = document.getElementById('btn-avatar-confirm');
    if (btnAvatarConfirm) {
        btnAvatarConfirm.addEventListener('click', () => {
            // 你可以在这里检查用户是否已选择 avatar
            // const selectedAvatar = document.querySelector('.avatar-item.selected');
            // if (!selectedAvatar) {
            //     alert('请选择一个头像');
            //     return;
            // }
            showPage('page-step3-mood');
        });
    }

    // --- 页面 5 (选择心情) 逻辑 ---
    const moodSelectButtons = document.querySelectorAll('.btn-mood-select');
    moodSelectButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 原型流程结束
            // 在实际项目中，这里会进入主应用界面
            alert('原型演示结束。');
            // 或者跳回第一页
            // showPage('page-welcome');
        });
    });
});