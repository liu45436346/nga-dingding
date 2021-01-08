
const request = require("../utils/request");

function getReplyList(page) {
    let query = {
        tid: 24929177,
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
        access_token: '8b4d43a3b9b146445e9433b269ebe6990beb645c5206ae89eb0828e566acadf6',
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
