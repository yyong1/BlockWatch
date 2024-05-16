function updateNavBasedOnAuth() {
  if (AuthCheck.isValid() && !AuthCheck.isExpired()) {
    $('#nav-stocklist, #nav-favorite, #nav-user').show();
    $('#top-login').text('Logout').off('click').on('click', function() {
      localStorage.removeItem('token');
      updateNavBasedOnAuth();
      window.location.href = '#login';
    });
    $('#nav-user').show();
    $('#nav-login').hide();
  } else {
    $('#nav-stocklist, #nav-favorite, #nav-user').hide();
    $('#nav-login').text('Login').off('click').on('click', function() {
      window.location.href = '#login';
    });
    $('#nav-user').hide();
  }
}
