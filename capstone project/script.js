document.addEventListener('DOMContentLoaded', function () {
    // Helper function for safe localStorage operations
    function getUsersFromStorage() {
        try {
            const data = localStorage.getItem('users');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.warn('Error reading users from localStorage:', error);
            return [];
        }
    }

    function saveUsersToStorage(users) {
        try {
            localStorage.setItem('users', JSON.stringify(users));
        } catch (error) {
            console.warn('Error saving users to localStorage:', error);
            alert('Error saving user data. Please check your browser settings.');
        }
    }

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

            var users = getUsersFromStorage();
            var exists = users.some(function (u) { return u.email === email; });
            if (exists) {
                alert('An account with that email already exists. Please sign in.');
                window.location.href = 'index.html';
                return;
            }

            users.push({ firstName: firstName, email: email, password: password });
            saveUsersToStorage(users);

            alert('Account created successfully!');
            window.location.href = 'index.html';
        });
    }

    // Helper function for safe currentUser operations
    function getCurrentUserFromStorage() {
        try {
            const data = localStorage.getItem('currentUser');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Error reading current user from localStorage:', error);
            return null;
        }
    }

    function saveCurrentUserToStorage(user) {
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } catch (error) {
            console.warn('Error saving current user to localStorage:', error);
            alert('Error saving session. Please check your browser settings.');
        }
    }

    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var username = (document.getElementById('username') || {}).value || '';
            var password = (document.getElementById('password') || {}).value || '';

            var users = getUsersFromStorage();
            var user = users.find(function (u) { return u.email === username && u.password === password; });

                    if (user) {
                        saveCurrentUserToStorage(user);
                        window.location.href = 'dashboard.html';
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
        try {
            const data = localStorage.getItem('activities');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.warn('Error reading activities from localStorage:', error);
            return [];
        }
    }

    function saveActivities(list) {
        try {
            localStorage.setItem('activities', JSON.stringify(list));
            // also write a timestamped signal to trigger storage listeners in other tabs
            localStorage.setItem('activities_update', Date.now().toString());
        } catch (error) {
            console.warn('Error saving activities to localStorage:', error);
        }
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

    // user helpers for account page (updated to use safe functions)
    function getCurrentUser() {
        return getCurrentUserFromStorage();
    }

    function saveCurrentUser(user) {
        if (!user) return;
        saveCurrentUserToStorage(user);
        // also update in users list if present
        var users = getUsersFromStorage();
        var idx = users.findIndex(function(u){ return u.email === user.email; });
        if (idx >= 0) {
            users[idx] = user;
            saveUsersToStorage(users);
        }
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