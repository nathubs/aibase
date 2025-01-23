import axios, { AxiosInstance } from 'axios';
import CryptoJS from 'crypto-js';

const API_KEY = 'ak-0MvOsS1KdDKbyYax';
const API_SECREKEY = 'sk-styOKHZsQcwb5ByfRovrlCTbIfign7zR';

function base64UrlEncode(str: string) {
  let encodedSource = CryptoJS.enc.Base64.stringify(str as unknown as CryptoJS.lib.WordArray);
  const reg = new RegExp('/', 'g');
  encodedSource = encodedSource.replace(/=+$/, '').replace(/\+/g, '-').replace(reg, '_');
  return encodedSource;
}

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
  return llmService.get<unknown, {
    data: ChatAPP[]
  }>('/v1/apps', {
    params: {
      workspace_id: '924c0536-3253-4607-897a-f8e2e638bd73',
      sign: 'f58bfa53930513c971cc2c6a1f3a6fd4',
      page: 1,
      limit: 20,
      mode: 'all'
    }
  });
}

export const getAccessToken = (appId: string) => {
  const exp = new Date(); // 获取当前时间
  exp.setMinutes(exp.getMinutes() + 30); // 加上30分钟
  Math.floor(exp.getTime() / 1000); // 转换为秒并返回
  const payload =  JSON.stringify({
    "app_id": appId, // bot id。访问bot api时需要
    "dataset_id": "", // 知识库id。访问知识库api时需要，创建知识库除外
    "user": "ubt-demo", // 用户ID。可选
    "access_key": API_KEY, // access key
    "iat": Math.floor(Date.now() / 1000), // 签发时间戳
    "exp": Math.floor(exp.getTime() / 1000), // 有效时间建议30分钟
    "jti": new Date().getTime() // 随机数
  });
  const header = JSON.stringify({
    "alg": "HS256",
    "typ": "JWT"
  })

  const before_sign = base64UrlEncode(CryptoJS.enc.Utf8.parse(header) as unknown as string) + '.' + base64UrlEncode(CryptoJS.enc.Utf8.parse(payload) as unknown as string);
  const signature = CryptoJS.HmacSHA256(before_sign, API_SECREKEY);
  const final_sign = before_sign + '.' + base64UrlEncode(signature as unknown as string);

  return final_sign;

}

export default llmService;