document.getElementById('sign-in-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var userData = localStorage.getItem('userData');
    var users = userData ? JSON.parse(userData) : [];
    var user = users.find(function(user) {
        return user.username === username && user.password === password;
    });
    if (user) {



        $("#sign-in-btn").html('<i class="fa fa-spinner fa-spin"></i>');

        setTimeout(function() { 
            localStorage.setItem("loggedInUser", username);
            localStorage.setItem("loggedInUserEmail", user.email); // Save user's email
            localStorage.setItem("loginTime", Date.now()); 
            document.getElementById('error-call').style.display = "none";
            document.getElementById('success-call').style.display = "block";
             
            $("#sign-in-btn").html("Login");
            setTimeout(function() {
                window.location.hash = 'account';   
            }, 3000);    
            document.getElementById('nav-login').setAttribute('href', '#account');
            document.getElementById('top-login').removeAttribute('href');
            document.getElementById('top-login').innerText = 'Logout'; 
            document.getElementById('top-login').setAttribute('id',"logout")

            
        }, 3000); // 2000 milliseconds (2 seconds) delay
    } else {
        console.log("User not found"); // Debug statement
        document.getElementById('error-call').style.display = "block";
        document.getElementById('success-call').style.display = "none";
    }

    return false;
});
