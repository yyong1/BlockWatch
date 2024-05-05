$(document).ready(function () {
  const emailValue = localStorage.getItem("loggedInUserEmail");
  const usernameValue = localStorage.getItem("loggedInUser");

  if (emailValue && usernameValue) {
    document.getElementById("acc-email").value = emailValue;
    document.getElementById("acc-username").value = usernameValue;
  }
});