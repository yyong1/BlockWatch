var AuthCheck = {
  getToken: function() {
    return localStorage.getItem('token');
  },
  isValid: function() {
    const token = this.getToken();
    if (!token || token.split('.').length !== 3) {
      return false;
    }
    return true;
  },
  isExpired: function() {
    const token = this.getToken();
    if (!token || token.split('.').length !== 3) {
      return true;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if (!payload.exp) {
      return true;
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return payload.exp < currentTimestamp;
  }
};
