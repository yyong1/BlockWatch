document.getElementById('sign-up-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    var existingData = localStorage.getItem('userData');
    var existingUsers = existingData ? JSON.parse(existingData) : [];

    if (!Array.isArray(existingUsers)) {
        existingUsers = [];
    }

    var userExists = existingUsers.some(function(user) {
        return user.username === username || user.email === email;
    });

    if (userExists) {
        document.getElementById('error-call').style.display = "block";
    } else {
        var newUser = {
            username: username,
            email: email,
            password: password
        };
        existingUsers.push(newUser);
        localStorage.setItem('userData', JSON.stringify(existingUsers));

        // Clear form fields
        document.getElementById('username').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';

        // Show success message

        $("#sign-up-button").html('<i class="fa fa-spinner fa-spin"></i>');

        setTimeout(function() { 
            document.getElementById('error-call').style.display = "none";
            document.getElementById('success-call').style.display = "block";
            $("#sign-up-button").html("Sign Up");
            setTimeout(function() {
                window.location.hash = 'login';
            }, 3000);
            
        }, 3000); // 2000 milliseconds (2 seconds) delay
    }

    return false;
});
