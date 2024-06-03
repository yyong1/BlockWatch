var RestClient = {
  get: function (url, callback, error_callback) {
    $.ajax({
      url: Constants.API_BASE_URL + url,
      type: "GET",
      beforeSend: function (xhr) {
        var token = Utils.get_from_localstorage("user").token;
        console.log("Sending token: ", token);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: function (response) {
        console.log("AJAX Success: ", response);
        if (callback) callback(response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX Error: ", textStatus, errorThrown);
        if (error_callback) error_callback(jqXHR);
      },
    });
  },
  request: function (url, method, data, callback, error_callback) {
    $.ajax({
      url: Constants.API_BASE_URL + url,
      type: method,
      contentType: "application/json",
      data: JSON.stringify(data),
      beforeSend: function (xhr) {
        if (Utils.get_from_localstorage("user")) {
          xhr.setRequestHeader("Authorization", "Bearer " + Utils.get_from_localstorage("user").token);
        }
      },
      success: function (response) {
        if (callback) callback(response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (error_callback) {
          error_callback(jqXHR);
        } else {
          console.error(jqXHR.responseJSON.message);
        }
      }
    });
  },
  post: function (url, data, callback, error_callback) {
    RestClient.request(url, "POST", data, callback, error_callback);
  },
  patch: function (url, data, callback, error_callback) {
    RestClient.request(url, "PATCH", data, callback, error_callback);
  },
  delete: function (url, data, callback, error_callback) {
    RestClient.request(url, "DELETE", data, callback, error_callback);
  },
  put: function (url, data, callback, error_callback) {
    RestClient.request(url, "PUT", data, callback, error_callback);
  }
};
