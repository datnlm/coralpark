import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_HOST_API_KEY;
// axios.defaults.headers.common = {
//   Authorization: `Bearer ${localStorage.getItem('accessToken')}`
// };

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('set accessToken sau khi login');
    axios.defaults.headers.common = {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
