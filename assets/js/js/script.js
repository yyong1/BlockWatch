var UserAuth = {
    isLoggedIn: function() {
        return localStorage.getItem("loggedInUser") !== null;
    },
    handleLogout: function() {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInUserEmail');
        localStorage.removeItem('loginTime');
        window.location.href = '#home';
        window.location.reload();
    },
    init: function() {
        window.addEventListener('load', this.checkLoggedIn.bind(this));
        document.addEventListener('click', this.handleLogoutClick.bind(this));
    },
    checkLoggedIn: function() {
        var isLoggedIn = this.isLoggedIn();
        if (isLoggedIn) {
            document.getElementById('nav-login').setAttribute('href', '#account');
            document.getElementById('top-login').removeAttribute('href');
            document.getElementById('top-login').innerText = 'Logout';
            document.getElementById('top-login').setAttribute('id', "logout");
        }
    },
    handleLogoutClick: function(event) {
        if (event.target && event.target.id === 'logout') {
            this.handleLogout();
        }
    }
};

UserAuth.init();
