var SignInForm = {
    init: function() {
        document.getElementById('sign-in-form').addEventListener('submit', this.handleSubmit.bind(this));
    },
    handleSubmit: function(event) {
        event.preventDefault();

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        
        if (Utils.get_from_localstorage('user')) {
            console.log("User already logged in");
            location.replace('#stocklist');
        }
        if (!email || !password) {
            console.error("Email and password must be provided");
            return;
        }


        Utils.block_ui('#sign-in-form');

        var userData = {
            email: email,
            password: password
        };
        console.log("userData", JSON.stringify(userData));

        RestClient.post('/auth/login', JSON.stringify(userData), function (response) {
            console.log("Login successful", response);
            Utils.unblock_ui('#sign-in-form');

            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            updateNavBasedOnAuth();
            location.replace('#stocklist');
        }, function (jqXHR) {
            Utils.unblock_ui('#sign-in-form');
            console.log("Login failed:", jqXHR);
            console.error("Login failed:", jqXHR);
            document.getElementById('error-call').style.display = "block";
            document.getElementById('error-call').innerHTML = (jqXHR.responseJSON && jqXHR.responseJSON.message) ? jqXHR.responseJSON.message : "An unknown error occurred";
        });

        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        $("#sign-in-btn").html('<i class="fa fa-spinner fa-spin"></i>');
    }
};
