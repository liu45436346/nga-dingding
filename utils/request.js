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
    // config.headers['Cookie'] = 'ngacn0comUserInfo=liu45436346%09liu45436346%0939%0939%09%0910%098200%094%090%090%0961_23; ngacn0comUserInfoCheck=38a5436e32641f7eed838b40d801a15b; ngacn0comInfoCheckTime=1595830181; ngaPassportUid=14323534; ngaPassportUrlencodedUname=liu45436346; ngaPassportCid=5f812885dac609d789a5914a12e4ab6c2271d944; lastvisit=1595830683; lastpath=/read.php?tid=21729074&authorid=60002731&page=238&__output=11&__inchst=UTF8'
    config.headers['Cookie'] = 'UM_distinctid=175fe86298e382-0dc6161f64f0b3-10201b0b-1fa400-175fe86298f8c0; taihe_bi_sdk_uid=890b3c877c445dfa724de9ccb40f674e; taihe_bi_sdk_session=1ec08972a74dcc4ab89e91156ab7818e; ngacn0comUserInfo=liu45436346%09liu45436346%0939%0939%09%0910%098200%094%090%090%0961_23; ngacn0comUserInfoCheck=0c450671b5987cc03d88877cd63717db; ngacn0comInfoCheckTime=1610096731; ngaPassportUid=14323534; ngaPassportUrlencodedUname=liu45436346; ngaPassportCid=5f812885dac609d789a5914a12e4ab6c2271d944; CNZZDATA30043604=cnzz_eid%3D818120056-1606290640-https%253A%252F%252Fwww.baidu.com%252F%26ntime%3D1610096983; taihe=6a0191501f29705438e7dd931cc4d627; taihe_session=5c9e83c66ba8edffe46e7f34ebec2bfb; UM_distinctid=176e147c266447-01279af9265875-10201b0b-1fa400-176e147c2671af; lastpath=/read.php?tid=24929177; lastvisit=1610097510; bbsmisccookies=%7B%22pv_count_for_insad%22%3A%7B0%3A-23%2C1%3A1610125268%7D%2C%22insad_views%22%3A%7B0%3A1%2C1%3A1610125268%7D%2C%22uisetting%22%3A%7B0%3A%22j%22%2C1%3A1610097811%7D%7D; _cnzz_CV30043604=forum%7Cfid706%7C0'
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
