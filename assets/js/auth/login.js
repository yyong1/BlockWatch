$(document).on('spapp:page:load', '#login', function () {
  console.log('login page loaded');
  $('#sign-in-form').validate({
    rules: {
      username: {
        required: true
      },
      password: {
        required: true
      }
    },
    messages: {
      username: {
        required: "Please enter your username"
      },
      password: {
        required: "Please enter your password"
      }
    },
    submitHandler: function (form) {
      console.log('here');
      var data = $(form).serialize();
      $.ajax({
        url: 'userlog.json',
        type: 'GET',
        dataType: 'json',
        data: data,
        success: function (response) {
          console.log('in success');
          var users = response.users;
          var username = $('#username').val();
          var password = $('#password').val();
          var validUser = users.find(user => user.username === username && user.password === password);
          console.log('here');
          if (validUser) {
            console.log('in if');
            // window.location.href = 'account.html';
          } else {
            alert('Invalid username or password');
          }
        },
        error: function (xhr, status, error) {
          console.log('in err');

          console.error({ xhr, status, error });
          const errorMessage = xhr.responseText ? JSON.parse(xhr.responseText).message : 'Unknown error';
          alert(errorMessage);
        }
      });
    }
  });
});