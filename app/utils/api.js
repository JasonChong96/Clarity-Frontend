import axios from 'axios';
import { push } from 'connected-react-router';

const ACCESS_TOKEN_KEY = 'access_token';

const oraAxios = axios.create({
  baseURL: 'http://157.230.253.130:8000', // URL here
});

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

oraAxios.interceptors.request.use(
  config => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

oraAxios.interceptors.response.use(response => response, function(error) {
  const originalRequest = error.config;

  if (
    error.response &&
    error.response.status === 401 &&
    originalRequest.url.endsWith('refresh')
  ) {
    push('/');
    return Promise.reject(error);
  }

  if (
    error.response &&
    error.response.status === 401 &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    return axios.post('/refresh', {}).then(res => {
      if (res.status === 201) {
        setAccessToken(res.data.access_token);
        axios.defaults.headers.common.Authorization = `Bearer ${getAccessToken()}`;
        return axios(originalRequest);
      }
    });
  }
  return Promise.reject(error);
});

export function post(url, payload, callback, errorHandler) {
  return oraAxios
    .post(url, payload)
    .then(response => callback(response))
    .catch(error => errorHandler(error));
}

export function get(url, callback, errorHandler) {
  return oraAxios
    .get(url)
    .then(response => callback(response))
    .catch(error => errorHandler(error));
}

export function patch(url, payload, callback, errorHandler) {
  return oraAxios
    .patch(url, payload)
    .then(response => callback(response))
    .catch(error => errorHandler(error));
}

export function put(url, payload, callback, errorHandler) {
  return oraAxios
    .put(url, payload)
    .then(response => callback(response))
    .catch(error => errorHandler(error));
}
