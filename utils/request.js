const axios = require("axios");
// create an axios instance
const service = axios.create({
  baseURL: 'https://bbs.nga.cn', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 40000, // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Cookie'] = 'ngacn0comUserInfo=liu45436346%09liu45436346%0939%0939%09%0910%098200%094%090%090%0961_23; ngacn0comUserInfoCheck=38a5436e32641f7eed838b40d801a15b; ngacn0comInfoCheckTime=1595830181; ngaPassportUid=14323534; ngaPassportUrlencodedUname=liu45436346; ngaPassportCid=5f812885dac609d789a5914a12e4ab6c2271d944; lastvisit=1595830683; lastpath=/read.php?tid=21729074&authorid=60002731&page=238&__output=11&__inchst=UTF8'
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const errcode = res.errcode
    if (errcode) {
      let msg =  `错误码:${errcode}---${res.errmsg}`
      return Promise.reject(new Error(msg))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

module.exports = service
