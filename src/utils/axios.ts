import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_HOST_API_KEY;
axios.defaults.headers.common = {
  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTGUgVGFuIFRydW9uZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InRydW9uZ2x0c2UxNDA5MDNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQUQiLCJuYmYiOjE2NTA1MDAzMjEsImV4cCI6MTY1MDUwNzUyMSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEifQ.mx-eg7VNPlmwSz3MX9h_F7yIazmwV9cucJONS0MHtac`
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
