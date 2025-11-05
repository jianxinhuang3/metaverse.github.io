// 用户信息管理
const UserInfo = {
    init() {
        this.addUserInfoToAllPages();
        this.updateUserInfo();
    },

    // 添加用户信息显示区域到所有页面
    addUserInfoToAllPages() {
        const userInfoHTML = `
            <div class="user-info">
                <span class="username">游客</span>
                <div class="avatar-container">
                    <span class="placeholder">头像</span>
                </div>
                <div class="mood-container">
                    <span class="placeholder">心情</span>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', userInfoHTML);
    },

    // 更新用户信息显示
    updateUserInfo() {
        const username = localStorage.getItem('username') || '陈大文';
        const avatarSrc = localStorage.getItem('selectedAvatar');
        const mood = localStorage.getItem('selectedMood');

        // 更新用户名
        const usernameElement = document.querySelector('.user-info .username');
        if (usernameElement) {
            usernameElement.textContent = username;
        }

        // 更新头像
        const avatarContainer = document.querySelector('.user-info .avatar-container');
        if (avatarContainer) {
            if (avatarSrc) {
                avatarContainer.innerHTML = `<img src="${avatarSrc}" alt="Avatar">`;
            } else {
                avatarContainer.innerHTML = `<span class="placeholder">头像</span>`;
            }
        }

        // 更新心情
        const moodContainer = document.querySelector('.user-info .mood-container');
        if (moodContainer) {
            if (mood) {
                const moodImage = `../img/moods/${mood.charAt(0).toUpperCase() + mood.slice(1)}.png`;
                moodContainer.innerHTML = `<img src="${moodImage}" alt="Mood">`;
            } else {
                moodContainer.innerHTML = `<span class="placeholder">心情</span>`;
            }
        }
    }
};

// 等待 DOM 内容加载完毕后再执行脚本
document.addEventListener("DOMContentLoaded", () => {
    // 初始化用户信息显示
    UserInfo.init();

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
            window.location.href = 'step1-name.html';
        });
    }

    // --- 页面 2 (输入名字) -> 页面 3 (选择模式) ---
    const btnNameConfirm = document.getElementById('btn-name-confirm');
    if (btnNameConfirm) {
        btnNameConfirm.addEventListener('click', () => {
            const username = document.getElementById('username-input').value;
            if (username.trim()) {
                localStorage.setItem('username', username);
                UserInfo.updateUserInfo(); // 更新显示
                // window.location.href = 'step1-mode.html';
                window.location.href = 'step2-avatar.html';
            } else {
                alert('请输入用户名');
            }
        });
    }

    // // --- 页面 3 (选择模式) -> 页面 4 (选择Avatar) ---
    // const modeSelectButtons = document.querySelectorAll('.btn-select-mode');
    // modeSelectButtons.forEach(button => {
    //     button.addEventListener('click', () => {
    //         window.location.href = 'step2-avatar.html';
    //     });
    // });

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
            const selectedAvatar = document.querySelector('.avatar-item.selected img');
            if (selectedAvatar) {
                localStorage.setItem('selectedAvatar', selectedAvatar.src);
                UserInfo.updateUserInfo(); // 更新显示
                window.location.href = 'step3-mood.html';
            } else {
                alert('请选择一个头像');
            }
        });
    }

    // --- 页面 5 (选择心情) 逻辑 ---
    const moodSelectButtons = document.querySelectorAll('.btn-mood-select');
    moodSelectButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            localStorage.setItem('selectedMood', mood);
            UserInfo.updateUserInfo(); // 更新显示
            alert('原型演示结束。\n用户名: ' + localStorage.getItem('username') +
                  '\n头像: ' + localStorage.getItem('selectedAvatar') +
                  '\n心情: ' + mood);
        });
    });
});
