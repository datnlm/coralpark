import axios from 'axios';

// axios.defaults.baseURL = process.env.REACT_APP_HOST_API_KEY;
// axios.defaults.baseURL = 'http://104.45.197.106:8080';
axios.defaults.baseURL = process.env.REACT_APP_HOST_API_KEY;
axios.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
};

// axios.defaults.headers.common = {
//   Authorization: `Bearer ${process.env.AUTH_TOKEN}`
// };
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// ----------------------------------------------------------------------

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
// export default function setAuthToken(token) {
//   axios.defaults.headers.common['Authorization'] = '';
//   delete axios.defaults.headers.common['Authorization'];

//   if (token) {
//     axios.defaults.headers.common['Authorization'] = `${token}`;
//   }
// }
