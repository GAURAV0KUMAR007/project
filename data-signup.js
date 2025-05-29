document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopup = document.getElementById('close-popup');
    const continueBtn = document.getElementById('continue-button');
    const balloonContainer = document.getElementById('balloon-container');

    let balloonInterval;

    function startBalloons() {
        balloonInterval = setInterval(() => {
            const colors = ['red', 'pink', 'green', 'yellow', 'golden'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const balloon = document.createElement('img');
            balloon.src = `src/${color}.png`;
            balloon.className = 'floating-balloon';
            balloon.style.left = Math.random() * 75 + '%';
            balloon.style.width = '43px';
            balloon.style.height = '62px';
            balloon.style.position = 'absolute';
            balloon.style.bottom = '0';
            balloon.style.zIndex = '1001';
            balloon.style.pointerEvents = 'none';
            balloonContainer.appendChild(balloon);

            // Remove balloon after animation
            balloon.addEventListener('animationend', () => {
                balloon.remove();
            });
        }, 250); // New balloon every 250ms
    }

    function stopBalloons() {
        clearInterval(balloonInterval);
        balloonContainer.innerHTML = '';
    }

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Error divs
        const usernameError = document.getElementById('username-error');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');

        // Clear previous errors
        usernameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';

        const username = document.getElementById('signup-username').value.trim();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;

        let hasError = false;

        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            emailError.textContent = 'Please enter a valid email address.';
            hasError = true;
        }

        // Password length check
        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters.';
            hasError = true;
        }

        // Get users from localStorage or empty array
        let users = JSON.parse(localStorage.getItem('users') || '[]');

        // Username exists check
        const usernameExists = users.some(user => user.username === username);
        if (usernameExists) {
            usernameError.textContent = 'Username already exists!';
            hasError = true;
        }

        // Email exists check
        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            emailError.textContent = 'Email already exists!';
            hasError = true;
        }

        if (hasError) return;

        // Save new user
        users.push({ username, name, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        // Show popup and start balloons
        popupOverlay.style.display = 'flex';
        signupForm.reset();
        startBalloons();
    });

    // Hide popup on close
    closePopup.onclick = function() {
        popupOverlay.style.display = 'none';
        stopBalloons();
    };

    // Continue button redirects to index.html
    continueBtn.onclick = function() {
        stopBalloons();
        window.location.href = 'index.html';
    };

    // Close popup when clicking outside of it
    popupOverlay.addEventListener('click', function (e) {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = 'none';
            stopBalloons();
        }
    });

    // Error clear on input
    document.getElementById('signup-username').addEventListener('input', function() {
        document.getElementById('username-error').textContent = '';
    });
    document.getElementById('signup-email').addEventListener('input', function() {
        document.getElementById('email-error').textContent = '';
    });
    document.getElementById('signup-password').addEventListener('input', function() {
        document.getElementById('password-error').textContent = '';
    });

    // --- TESTING: Show congratulations popup manually ---
    popupOverlay.style.display = 'flex'; // <-- Remove or comment out after testing
    startBalloons(); // <-- Remove or comment out after testing
    // ---------------------------------------------------
});