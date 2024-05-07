var AccountDetails = {
  init: function() {
      $(document).ready(this.populateAccountDetails.bind(this));
  },
  populateAccountDetails: function() {
      const emailValue = localStorage.getItem("loggedInUserEmail");
      const usernameValue = localStorage.getItem("loggedInUser");

      if (emailValue && usernameValue) {
          document.getElementById("acc-email").value = emailValue;
          document.getElementById("acc-username").value = usernameValue;
      }
  }
};

// Initialize the AccountDetails object
AccountDetails.init();
