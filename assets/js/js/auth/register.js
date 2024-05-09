var SignUpForm = {
    init: function () {
        document.getElementById('sign-up-form').addEventListener('submit', this.handleSubmit.bind(this));
    },
    handleSubmit: function (event) {
        event.preventDefault();

        var username = document.getElementById('username').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        Utils.block_ui('#sign-up-form');

        var newUser = {
            username: username,
            email: email,
            password: password
        };

        RestClient.post('/auth/signup', JSON.stringify(newUser), function (response) {
            Utils.unblock_ui('#sign-up-form');
            console.log("Reg successful", response);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            location.replace('#stocklist');
        }, function (jqXHR) {
            Utils.unblock_ui('#sign-up-form');
            console.error(jqXHR);
            document.getElementById('error-call').style.display = "block";
            document.getElementById('error-call').innerHTML = jqXHR.responseJSON.message;
        });

        document.getElementById('username').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';

        $("#sign-up-button").html('<i class="fa fa-spinner fa-spin"></i>');

    }
};
