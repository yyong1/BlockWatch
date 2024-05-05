
$(document).ready(function () {
  $("#change-password").submit(function (event) {
    event.preventDefault();

    const currentPassword = $("#current").val().trim();
    const newPassword = $("#password").val().trim();
    const confirmPassword = $("#confirm-password").val().trim();

    if (newPassword !== confirmPassword) {
      console.log("Password Did not Match with User");

      $("#error-call")
        .text("Passwords do not match.")
        .css("display", "block");
      $("#success-call").css("display", "none");
      return;
    }


    let userData = JSON.parse(localStorage.getItem("userData")) || [];


    const loggedInUser = localStorage.getItem("loggedInUser");
    const loggedInUserIndex = userData.findIndex(
      (user) => user.username === loggedInUser
    );

    if (
      loggedInUserIndex === -1 ||
      userData[loggedInUserIndex].password !== currentPassword
    ) {
      console.log("Current password is incorrect.");

      $("#error-call")
        .text("Current password is incorrect.")
        .css("display", "block");
      $("#success-call").css("display", "none");
      return;
    }


    userData[loggedInUserIndex].password = newPassword;

    localStorage.setItem("userData", JSON.stringify(userData));

    $("#change-password-button").html(
      '<i class="fa fa-spinner fa-spin"></i>'
    );

    setTimeout(function () {
      $("#success-call")
        .text("Password changed successfully.")
        .css("display", "block");
      $("#error-call").css("display", "none");

      $("#current").val("");
      $("#password").val("");
      $("#confirm-password").val("");

      setTimeout(function () {
        $("#change-password-button").html("Change");
      }, 3000);
    }, 1000);
  });
});