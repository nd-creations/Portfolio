document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // SOCIAL LINKS MANAGEMENT
    // ==========================================
    const socialLinks = {
        github: '',
        linkedin: '',
        twitter: '',
        instagram: ''
    };

    // Load saved links from sessionStorage
    function loadSocialLinks() {
        const saved = sessionStorage.getItem('socialLinks');
        if (saved) {
            Object.assign(socialLinks, JSON.parse(saved));
            updateSocialIcons();
        }
    }

    // Update social icon links
    function updateSocialIcons() {
        const githubLink = document.querySelector('[data-platform="github"]');
        const linkedinLink = document.querySelector('[data-platform="linkedin"]');
        const twitterLink = document.querySelector('[data-platform="twitter"]');
        const instagramLink = document.querySelector('[data-platform="instagram"]');

        if (socialLinks.github) {
            githubLink.href = `https://github.com/${socialLinks.github}`;
        } else {
            githubLink.href = 'https://github.com';
        }

        if (socialLinks.linkedin) {
            linkedinLink.href = `https://www.linkedin.com/in/${socialLinks.linkedin}`;
        } else {
            linkedinLink.href = 'https://www.linkedin.com';
        }

        if (socialLinks.twitter) {
            twitterLink.href = `https://x.com/${socialLinks.twitter}`;
        } else {
            twitterLink.href = 'https://x.com';
        }

        if (socialLinks.instagram) {
            instagramLink.href = `https://instagram.com/${socialLinks.instagram}`;
        } else {
            instagramLink.href = 'https://instagram.com';
        }
    }

    // ==========================================
    // SETTINGS MODAL
    // ==========================================
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
        document.getElementById('githubInput').value = socialLinks.github;
        document.getElementById('linkedinInput').value = socialLinks.linkedin;
        document.getElementById('twitterInput').value = socialLinks.twitter;
        document.getElementById('instagramInput').value = socialLinks.instagram;
    });

    cancelBtn.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });

    saveBtn.addEventListener('click', () => {
        socialLinks.github = document.getElementById('githubInput').value.trim();
        socialLinks.linkedin = document.getElementById('linkedinInput').value.trim();
        socialLinks.twitter = document.getElementById('twitterInput').value.trim();
        socialLinks.instagram = document.getElementById('instagramInput').value.trim();
        
        sessionStorage.setItem('socialLinks', JSON.stringify(socialLinks));
        updateSocialIcons();
        settingsModal.classList.remove('active');
        
        let message = 'Social links saved!\n\n';
        if (socialLinks.github) message += `GitHub: ${socialLinks.github}\n`;
        if (socialLinks.linkedin) message += `LinkedIn: ${socialLinks.linkedin}\n`;
        if (socialLinks.twitter) message += `Twitter: ${socialLinks.twitter}\n`;
        if (socialLinks.instagram) message += `Instagram: ${socialLinks.instagram}\n`;
        alert(message + '\nClick the icons to visit your profiles!');
    });

    // ==========================================
    // FLAPPY BIRD GAME
    // ==========================================
    const gameModal = document.getElementById("gameModal");
    const playGameBtn = document.getElementById("playGameBtn");
    const closeGameBtn = document.getElementById("closeGameBtn");
    const startGameBtn = document.getElementById("startGameBtn");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const bestDisplay = document.getElementById("bestDisplay");

    let canvas, ctx;
    let gameInterval;
    let bird, pipes, score, bestScore, gameStarted, gameOver;
    const gravity = 0.5;
    const jump = -8;
    const pipeGap = 150;
    const pipeSpeed = 2;

    // Load best score from localStorage
    bestScore = parseInt(localStorage.getItem('flappyBestScore')) || 0;
    bestDisplay.textContent = bestScore;

    // Open game modal
    playGameBtn.addEventListener("click", (e) => {
        e.preventDefault();
        gameModal.classList.add("active");
        initGame();
    });

    // Close game
    closeGameBtn.addEventListener("click", () => {
        gameModal.classList.remove("active");
        stopGame();
    });

    // Close on outside click
    gameModal.addEventListener("click", (e) => {
        if (e.target === gameModal) {
            gameModal.classList.remove("active");
            stopGame();
        }
    });

    // Start game button
    startGameBtn.addEventListener("click", () => {
        if (gameOver || !gameStarted) {
            resetGame();
            gameStarted = true;
            gameOver = false;
            startGameBtn.textContent = "Restart";
        }
    });

    // Initialize game
    function initGame() {
        canvas = document.getElementById("game");
        ctx = canvas.getContext("2d");
        
        resetGame();
        
        // Handle both click and touch
        canvas.addEventListener("click", handleJump);
        canvas.addEventListener("touchstart", handleJump);
        
        gameInterval = setInterval(updateGame, 1000 / 60); // 60 FPS
    }

    // Reset game state
    function resetGame() {
        bird = {
            x: 50,
            y: canvas.height / 2,
            velocity: 0,
            radius: 15
        };
        
        pipes = [];
        score = 0;
        gameStarted = false;
        gameOver = false;
        scoreDisplay.textContent = score;
        
        // Create initial pipes
        for (let i = 0; i < 3; i++) {
            pipes.push(createPipe(canvas.width + i * 200));
        }
    }

    // Create pipe
    function createPipe(x) {
        const minHeight = 50;
        const maxHeight = canvas.height - pipeGap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        return {
            x: x,
            topHeight: topHeight,
            bottomY: topHeight + pipeGap,
            width: 50,
            passed: false
        };
    }

    // Handle jump
    function handleJump(e) {
        e.preventDefault();
        if (!gameStarted || gameOver) return;
        bird.velocity = jump;
    }

    // Update game
    function updateGame() {
        // Clear canvas
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (gameStarted && !gameOver) {
            // Update bird
            bird.velocity += gravity;
            bird.y += bird.velocity;
            
            // Update pipes
            pipes.forEach((pipe, index) => {
                pipe.x -= pipeSpeed;
                
                // Check if pipe passed
                if (!pipe.passed && pipe.x + pipe.width < bird.x) {
                    pipe.passed = true;
                    score++;
                    scoreDisplay.textContent = score;
                    
                    // Update best score
                    if (score > bestScore) {
                        bestScore = score;
                        bestDisplay.textContent = bestScore;
                        localStorage.setItem('flappyBestScore', bestScore);
                    }
                }
                
                // Remove off-screen pipes and add new ones
                if (pipe.x + pipe.width < 0) {
                    pipes.splice(index, 1);
                    pipes.push(createPipe(canvas.width + 100));
                }
                
                // Check collision
                if (
                    bird.x + bird.radius > pipe.x &&
                    bird.x - bird.radius < pipe.x + pipe.width &&
                    (bird.y - bird.radius < pipe.topHeight ||
                     bird.y + bird.radius > pipe.bottomY)
                ) {
                    endGame();
                }
            });
            
            // Check ground/ceiling collision
            if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
                endGame();
            }
        }
        
        // Draw pipes
        ctx.fillStyle = "#2afc85";
        pipes.forEach(pipe => {
            // Top pipe
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
            // Bottom pipe
            ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);
            
            // Pipe borders
            ctx.strokeStyle = "#1a8f5c";
            ctx.lineWidth = 3;
            ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
            ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);
        });
        
        // Draw bird
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#FFA500";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw eye
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(bird.x + 5, bird.y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Start message
        if (!gameStarted) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
            ctx.fillStyle = "#fff";
            ctx.font = "bold 20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Click 'Start Game' to begin!", canvas.width / 2, canvas.height / 2);
            ctx.font = "16px Arial";
            ctx.fillText("Then tap/click to fly", canvas.width / 2, canvas.height / 2 + 25);
        }
        
        // Game over message
        if (gameOver) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillRect(0, canvas.height / 2 - 60, canvas.width, 120);
            ctx.fillStyle = "#ff4444";
            ctx.font = "bold 30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
            ctx.fillStyle = "#fff";
            ctx.font = "20px Arial";
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
            ctx.font = "16px Arial";
            ctx.fillText("Click 'Restart' to play again", canvas.width / 2, canvas.height / 2 + 45);
        }
    }

    // End game
    function endGame() {
        gameOver = true;
        startGameBtn.textContent = "Restart";
    }

    // Stop game
    function stopGame() {
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        if (canvas) {
            canvas.removeEventListener("click", handleJump);
            canvas.removeEventListener("touchstart", handleJump);
        }
    }

    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");
    const navLinks = document.querySelectorAll("nav a");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            const icon = menuToggle.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        });
    });

    // ==========================================
    // SMOOTH SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ==========================================
    // TYPING EFFECT
    // ==========================================
    const texts = ["Frontend Developer", "UI/UX Designer", "Web Consultant"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const element = document.querySelector(".typing-text");
        if (!element) return;
        
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex--);
        } else {
            element.textContent = currentText.substring(0, charIndex++);
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 1200);
            return;
        } 
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(type, isDeleting ? 50 : 100);
    }

    // ==========================================
    // INITIALIZE
    // ==========================================
    type();
    loadSocialLinks();
});
/* ============================================================
   PASTE THIS AT THE BOTTOM OF YOUR script.js
   (or just before the closing </body> tag in your HTML)
   ============================================================ */

/* ── SMOOTH CUSTOM CURSOR ─────────────────────────────────── */
(function () {
    // Create cursor elements
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.id  = 'nd-cursor';
    ring.id = 'nd-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;

    // Dot follows instantly
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    // Ring follows smoothly with lag (RAF loop)
    let ringX = 0, ringY = 0;
    function animateRing() {
        ringX += (mouseX - ringX) * 0.13;
        ringY += (mouseY - ringY) * 0.13;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Grow cursor on interactive elements
    const interactives = document.querySelectorAll('a, button, .skill, .project-card, input, textarea, label');
    interactives.forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            dot.style.transform  = 'translate(-50%, -50%) scale(2.4)';
            dot.style.background = '#00e5ff';
            ring.style.transform = 'translate(-50%, -50%) scale(1.4)';
            ring.style.borderColor = 'rgba(0,229,255,0.5)';
        });
        el.addEventListener('mouseleave', function () {
            dot.style.transform  = 'translate(-50%, -50%) scale(1)';
            dot.style.background = '#2afc85';
            ring.style.transform = 'translate(-50%, -50%) scale(1)';
            ring.style.borderColor = 'rgba(42,252,133,0.6)';
        });
    });

    // Hide cursor when mouse leaves the window
    document.addEventListener('mouseleave', function () {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });
})();