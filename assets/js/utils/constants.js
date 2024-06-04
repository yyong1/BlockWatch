var Constants = {
  get_api_base_url: function() {
    if (window.location.hostname === "localhost") {
      return "http://localhost:8888/BlockWatch/rest";
    } else {
      return "https://web-blockwatch-q785y.ondigitalocean.app/rest";
    }
  },
  API_BASE_URL: Constants.get_api_base_url(),
};