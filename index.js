document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const errorDiv = document.getElementById('login-error');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        errorDiv.textContent = '';

        const usernameOrEmail = usernameInput.value.trim();
        const password = passwordInput.value;

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u =>
            (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
            u.password === password
        );

        if (user) {
            // Login success - redirect or show success
            window.location.href = "data-page.html"; // ya jo bhi page ho
        } else {
            errorDiv.textContent = "Invalid username/email or password!";
            errorDiv.style.color = "red";
        }
    });
});