import axios from "axios";
// import qs from "qs";
const isDevelop = 1;
if (isDevelop) {
  axios.defaults.baseURL = `https://test178.nangua203.com/api`; //测试
} else {
  const href = window.location.host;
  var protocolStr = document.location.protocol;
  if (protocolStr == "http:") {
    axios.defaults.baseURL = `http://${href}/api`; //测试
  } else if (protocolStr == "https:") {
    axios.defaults.baseURL = `https://${href}/api`; //测试
  }
}

(axios as any).defaults.headers = {
  "Content-Type": "application/json;charset=utf-8",
};

const service = axios.create();
// axios前置拦截钩子
service.interceptors.request.use(
  (conf) => {
    return conf;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axios响应拦截钩子
service.interceptors.response.use(
  (response) => {
    if (response.status == 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    return Promise.reject(error);
    // alert(JSON.stringify(error), '请求异常', {
    //     confirmButtonText: '确定',
    //     callback: (action) => {
    //         console.log(action)
    //     }
    // });
  }
);
// qs.stringify()
const httpService = {
  /**
   * @param {String} url
   * @param {Object} data
   * @returns Promise
   */

  post(url: string, data: any, params: any = {}, headers: any = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        data, // 参数放bodyqs.stringify()
        params, // 参数放路径
        headers,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  imgPost(url: string, data: any, params: any = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        data,
        params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 参数放body => raw
  rawPost(url: string, data: any, params: any) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        data,
        params,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // // 参数放params
  // queryPost(url: string, data: any) {
  //   return new Promise((resolve, reject) => {
  //     axios({
  //       method: 'post',
  //       url,
  //       params: data,
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     })
  //       .then(res => {
  //         resolve(res)
  //       })
  //       .catch(err => {
  //         reject(err)
  //       });
  //   })
  // },

  get(url: string, data?: any) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url,
        params: data,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export default httpService;
