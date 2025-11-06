// 用户信息管理
const UserInfo = {
    init() {
        this.addUserInfoToAllPages();
        this.updateUserInfo();
        this.updateAvatarPreview(); // 在 Step 2 页面显示预览
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
        // 确保只添加一次
        if (!document.querySelector('.user-info')) {
            document.body.insertAdjacentHTML('afterbegin', userInfoHTML);
        }
    },

    // 更新右上角全局用户信息
    updateUserInfo() {
        const username = localStorage.getItem('username') || '游客';
        const avatarSrc = localStorage.getItem('selectedAvatar');
        const mood = localStorage.getItem('selectedMood');

        const usernameElement = document.querySelector('.user-info .username');
        if (usernameElement) {
            usernameElement.textContent = username;
        }

        const avatarContainer = document.querySelector('.user-info .avatar-container');
        if (avatarContainer) {
            if (avatarSrc) {
                avatarContainer.innerHTML = `<img src="${avatarSrc}" alt="Avatar">`;
            } else {
                avatarContainer.innerHTML = `<span class="placeholder">头像</span>`;
            }
        }

        const moodContainer = document.querySelector('.user-info .mood-container');
        if (moodContainer) {
            if (mood) {
                // 假设图片命名是首字母大写
                const moodImage = `../img/moods/${mood.charAt(0).toUpperCase() + mood.slice(1)}.png`;
                moodContainer.innerHTML = `<img src="${moodImage}" alt="Mood">`;
            } else {
                moodContainer.innerHTML = `<span class="placeholder">心情</span>`;
            }
        }
    },

    // 在 Step 2 页面更新头像预览
    updateAvatarPreview() {
        const avatarPreview = document.querySelector('.selected-avatar-preview');
        if (avatarPreview) {
            const avatarSrc = localStorage.getItem('selectedAvatar');
            if (avatarSrc) {
                avatarPreview.innerHTML = `<img src="${avatarSrc}" alt="Selected Avatar">`;
            } else {
                avatarPreview.innerHTML = `<span class="placeholder">Avatar</span>`;
            }
        }
    }
};

// --- 页面路由和事件绑定 ---
document.addEventListener("DOMContentLoaded", () => {
    // 初始化用户信息显示
    UserInfo.init();

    // --- 页面 1 (欢迎) -> 页面 1 (选择头像) ---
    const btnWelcomeEnter = document.getElementById('btn-welcome-enter');
    if (btnWelcomeEnter) {
        btnWelcomeEnter.addEventListener('click', () => {
            window.location.href = 'step1-avatar.html'; 
        });
    }

    // --- 页面 1 (选择头像) 逻辑 ---
    const avatarPage = document.getElementById('page-step1-avatar');
    if (avatarPage) {
        // Tab 切换 (Girl/Boy)
        const avatarTabs = avatarPage.querySelectorAll('.avatar-tab');
        const avatarGrids = avatarPage.querySelectorAll('.avatar-grid');

        avatarTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                avatarTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetGridId = tab.dataset.target;
                avatarGrids.forEach(grid => grid.classList.remove('active'));
                avatarPage.querySelector(`#${targetGridId}`)?.classList.add('active');
            });
        });

        // Avatar 选择高亮
        const avatarItems = avatarPage.querySelectorAll('.avatar-item');
        avatarItems.forEach(item => {
            item.addEventListener('click', () => {
                avatarItems.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
            });
        });

        // 确认按钮 -> 页面 2 (信息设置)
        const btnAvatarConfirm = avatarPage.querySelector('#btn-avatar-confirm');
        if (btnAvatarConfirm) {
            btnAvatarConfirm.addEventListener('click', () => {
                const selectedAvatar = avatarPage.querySelector('.avatar-item.selected img');
                if (selectedAvatar) {
                    localStorage.setItem('selectedAvatar', selectedAvatar.src);
                    UserInfo.updateUserInfo(); // 更新右上角
                    window.location.href = 'step2-info.html'; 
                } else {
                    alert('请选择一个头像');
                }
            });
        }
    }

    // --- 页面 2 (信息设置) -> 页面 3 (选择心情) ---
    const infoPage = document.getElementById('page-step2-info');
    if (infoPage) {
        const btnInfoConfirm = infoPage.querySelector('#btn-info-confirm');
        if (btnInfoConfirm) {
            btnInfoConfirm.addEventListener('click', () => {
                const nickname = infoPage.querySelector('#nickname-input').value;
                const realname = infoPage.querySelector('#realname-input').value;
                const age = infoPage.querySelector('#age-input').value;
                const mode = infoPage.querySelector('input[name="mode-selection"]:checked').value;

                // 根据模式选择要显示的用户名
                const username = (mode === 'anonymous') ? nickname : realname;
                
                if (!username || !username.trim()) {
                    alert('请输入昵称或真实姓名');
                    return;
                }

                localStorage.setItem('username', username);
                localStorage.setItem('realname', realname);
                localStorage.setItem('nickname', nickname);
                localStorage.setItem('age', age);
                localStorage.setItem('displayMode', mode);

                UserInfo.updateUserInfo(); // 更新右上角显示
                window.location.href = 'step3-mood.html'; 
            });
        }
    }

    // --- 页面 3 (选择心情) -> 页面 4 (疗愈星球) ---
    const moodPage = document.getElementById('page-step3-mood');
    if (moodPage) {
        const moodSelectButtons = moodPage.querySelectorAll('.btn-mood-select');
        moodSelectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mood = button.dataset.mood;
                localStorage.setItem('selectedMood', mood);
                UserInfo.updateUserInfo(); // 更新右上角显示
                window.location.href = 'step4-nova.html';
            });
        });
    }
    
    // --- 页面 4 (疗愈星球) 逻辑 ---
    const novaPage = document.getElementById('page-step4-nova');
    if (novaPage) {
        
        // Tab 切换逻辑
        const novaTabs = novaPage.querySelectorAll('.nova-tab');
        // *** 更改 ***：从 .nova-grid 改为 .nova-scroll-wrapper
        const novaScrollWrappers = novaPage.querySelectorAll('.nova-scroll-wrapper');

        novaTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                novaTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetGridId = tab.dataset.target;
                // *** 更改 ***：隐藏所有 wrapper
                novaScrollWrappers.forEach(wrapper => wrapper.classList.remove('active'));
                // *** 更改 ***：显示目标 wrapper
                novaPage.querySelector(`#${targetGridId}`)?.classList.add('active');
            });
        });

        // 选择一个星球 -> 进入疗愈空间
        const novaCards = novaPage.querySelectorAll('.nova-card');
        novaCards.forEach(card => {
            card.addEventListener('click', () => {
                const cardTitle = card.querySelector('h4').textContent;
                // 将选择的卡片信息存储到localStorage
                localStorage.setItem('selectedHealingSpace', cardTitle);
                // 跳转到疗愈空间
                window.location.href = 'step5-healing-space.html';
            });
        });
    }

    // --- 页面 5 (疗愈空间) 逻辑 ---
    const healingPage = document.getElementById('page-step5-healing');
    if (healingPage) {
        // 获取选择的疗愈空间
        const selectedSpace = localStorage.getItem('selectedHealingSpace');
        if (selectedSpace) {
            // 根据选择的卡片标题找到对应的视频文件名
            const videoMapping = {
                'Mushroom Forest': 'Calming- walking adventure.mp4',
                'Meditation': 'Calming-Meditation.mp4',
                'Reading': 'Calming-reading.mp4',
                'Skydiving': 'Energetic- skydiving.mp4',
                'Whack-a-mole': 'Energetic- whack-a-mole.mp4',
                'Diving': 'Energetic-diving.mp4',
                'Pet Healing': 'Connection- pet healing.mp4',
                'Virtual Idols': 'music healing-二次元偶像.mp4',
                'Action Games': 'music healing-节奏大师.mp4',
                'Lite Music': 'music healing-轻音乐.mp4'
            };

            const videoFile = videoMapping[selectedSpace];
            if (videoFile) {
                const videoSource = document.getElementById('video-source');
                videoSource.src = `../video/${videoFile}`;
                // 重新加载视频元素
                const videoElement = document.getElementById('healing-video');
                videoElement.load();
            }
        }

        // 退出疗愈按钮
        const btnExitHealing = document.getElementById('btn-exit-healing');
        if (btnExitHealing) {
            btnExitHealing.addEventListener('click', () => {
                // 返回首页
                window.location.href = 'welcome.html';
            });
        }
    }
});
