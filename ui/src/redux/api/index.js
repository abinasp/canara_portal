import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8001/api/";
axios.interceptors.request.use((config) => {
    let accessSecret;
    accessSecret = window.localStorage.getItem('canara_auth');
    if (accessSecret !== null || accessSecret !== undefined) {
      config.headers.access_token = accessSecret;
      config.headers.timezone = Date.now();
      return config;
    }
    return config;
  });
  
  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => Promise.reject(error.message));

export default axios;