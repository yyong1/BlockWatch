function handleRouteChange() {
  var route = window.location.hash;
  if (route === '#stocklist' || route === '#favorite') {
    if (!AuthCheck.isValid() || AuthCheck.isExpired()) {
      window.location.href = '#login';
      return;
    }
  }

  switch(route) {
    case '#home':
      $('#spapp').load('home.html');
      break;
    case '#stocklist':
      $('#spapp').load('stockexchange.html');
      break;
    case '#favorite':
      $('#spapp').load('fav.html');
      break;
    case '#login':
      $('#spapp').load('login.html');
      break;
    default:
      $('#spapp').load('home.html');
  }
}

$(window).on('hashchange', handleRouteChange);
$(document).ready(function() {
  handleRouteChange();
  updateNavBasedOnAuth();
});
