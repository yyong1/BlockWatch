
// Function to check if the user is logged in
function isLoggedIn() {
    return localStorage.getItem("loggedInUser") !== null;
}

// Function to handle logout

window.addEventListener('load', function() {
    // Check if user is logged in
    var isLoggedIn = localStorage.getItem('loggedInUser') !== null;

    if (isLoggedIn) {
        //window.location.hash = 'account';        
        document.getElementById('nav-login').setAttribute('href', '#account');
        document.getElementById('top-login').removeAttribute('href');
        document.getElementById('top-login').innerText = 'Logout'; 
        // document.getElementById('top-login').setAttribute('onclick', "logout");
        document.getElementById('top-login').setAttribute('id', "logout");
    } else {
        // User is not logged in
    }
});
document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'logout') {
        // Clear user data from localStorage
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInUserEmail');
        localStorage.removeItem('loginTime');
        window.location.href = '#home';
        window.location.reload();
    }
});


