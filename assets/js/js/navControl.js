function updateNavBasedOnAuth() {
  if (AuthCheck.isValid() && !AuthCheck.isExpired()) {
    $('#nav-stocklist, #nav-favorite').show();
    $('#nav-login').text('Logout').off('click').on('click', function() {
      localStorage.removeItem('token');
      updateNavBasedOnAuth();
      window.location.href = '#login';
    });
  } else {
    $('#nav-stocklist, #nav-favorite').hide();
    $('#nav-login').text('Login').off('click').on('click', function() {
      window.location.href = '#login';
    });
  }
}
