import axios from "axios";

const url = "http://120.55.97.163:8080";
axios.defaults.baseURL = url;

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // console.log(config, 123);
    let token = sessionStorage.getItem("token");
    token && (config.headers.token = token);
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
export default axios;
