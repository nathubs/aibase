import axios, { AxiosInstance } from 'axios';

const llmService: AxiosInstance = axios.create({
  baseURL: 'https://llm.nangua203.com',
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

llmService.interceptors.response.use(
  (response) => {
    if (response.status == 200) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getApps = () => {
  return llmService.get('/v1/apps', {
    params: {
      workspace_id: '924c0536-3253-4607-897a-f8e2e638bd73',
      sign: 'f58bfa53930513c971cc2c6a1f3a6fd4',
      page: 1,
      limit: 20,
      mode: 'all'
    }
  });
}

export default llmService;