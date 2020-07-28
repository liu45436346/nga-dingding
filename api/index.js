
const request = require("../utils/request");

function getReplyList(page) {
    let query = {
        tid: 21729074,
        authorid: 60002731,
        page: page,
        __output: 11,
        __inchst: 'UTF8',
    }
    return request({
        url: '/read.php',
        method: 'get',
        params: query
    })
}

function sendDataByDingDing(data) {
    let query = {
        access_token: '6a3627863e2a6d2ccaa74eea1fd161bf8e86edcf80eda95389133e2703cf4dcd',
    }
    return request({
        baseURL: 'https://oapi.dingtalk.com',
        url: '/robot/send',
        method: 'post',
        params: query,
        data: data,
    })
}

exports.getReplyList = getReplyList
exports.sendDataByDingDing = sendDataByDingDing
