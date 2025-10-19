document.addEventListener('DOMContentLoaded', function () {
    var signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var firstName = (document.getElementById('firstName') || {}).value || '';
            var email = (document.getElementById('email') || {}).value || '';
            var password = (document.getElementById('password') || {}).value || '';

            if (!email || !password) {
                alert('Please enter an email and password.');
                return;
            }

            var users = JSON.parse(localStorage.getItem('users') || '[]');
            var exists = users.some(function (u) { return u.email === email; });
            if (exists) {
                alert('An account with that email already exists. Please sign in.');
                window.location.href = 'index.html';
                return;
            }

            users.push({ firstName: firstName, email: email, password: password });
            localStorage.setItem('users', JSON.stringify(users));

            alert('Account created successfully!');
            window.location.href = 'index.html';
        });
    }

    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var username = (document.getElementById('username') || {}).value || '';
            var password = (document.getElementById('password') || {}).value || '';

            var users = JSON.parse(localStorage.getItem('users') || '[]');
            var user = users.find(function (u) { return u.email === username && u.password === password; });

                    if (user) {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        window.location.href = 'homepage.html';
                    } else {
                alert('Invalid credentials. Make sure you used the same email and password you registered with.');
            }
        });
    }

    var googleBtn = document.querySelector('.google-signin-button');
    if (googleBtn) {
        googleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Google Sign-in is not configured in this demo.');
        });
    }

    // Activity helpers (simple localStorage-backed feed)
    function getActivities() {
        return JSON.parse(localStorage.getItem('activities') || '[]');
    }

    function saveActivities(list) {
        localStorage.setItem('activities', JSON.stringify(list));
        // also write a timestamped signal to trigger storage listeners in other tabs
        localStorage.setItem('activities_update', Date.now().toString());
    }

    function addActivity(activity) {
        var list = getActivities();
        // prepend newest
        list.unshift(activity);
        saveActivities(list);
    }

    // expose to global for activity page to use
    window.activityAPI = {
        getActivities: getActivities,
        addActivity: addActivity,
        saveActivities: saveActivities
    };

    // user helpers for account page
    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('currentUser') || 'null');
        } catch (e) { return null; }
    }

    function saveCurrentUser(user) {
        if (!user) return;
        localStorage.setItem('currentUser', JSON.stringify(user));
        // also update in users list if present
        var users = JSON.parse(localStorage.getItem('users') || '[]');
        var idx = users.findIndex(function(u){ return u.email === user.email; });
        if (idx >= 0) { users[idx] = user; localStorage.setItem('users', JSON.stringify(users)); }
    }

    window.userAPI = { getCurrentUser: getCurrentUser, saveCurrentUser: saveCurrentUser };

    // Initialize activities if missing (sample data)
    if (!localStorage.getItem('activities')) {
        var sample = [
            { id: 1, title: 'Activity 1', body: 'Submit Activity 1 on or before October 2 via the Online Alert System', date: '06 Jan 23, 09:00 AM' },
            { id: 2, title: 'Act 2', body: 'Post an update regarding the revised Final Exam schedule', date: '12 Jan 23, 09:00 AM' },
            { id: 3, title: 'Act 3', body: 'Post a reminder about the Capstone Project submission deadline', date: '24 Jan 23, 09:00 AM' }
        ];
        saveActivities(sample);
    }
});