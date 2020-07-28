

const {getReplyList, sendDataByDingDing} = require("./api/index");
const schedule = require('node-schedule');
const log4js = require('log4js');
const loggerConfig = require('./config/logger.json');

log4js.configure(loggerConfig);
const logger = log4js.getLogger('custom-category');

let config = {
    // 当前页数
    readPage: 243,
    // 当前条数
    readRows: 4841,
}

const handleContent = function(res) {
    let currentRows = res.__ROWS
    let currentPage = Math.ceil(currentRows / 20)
    let currentRow = res.__R__ROWS
    let cod1 = config.readRows < currentRows && config.readPage === currentPage
    let cod2 = config.readPage < currentPage  && config.readPage < currentPage
    if (cod1) {
        config.readRows = currentRows
        return getContent(res)
    } else if (cod2) {
        config.readPage = currentPage
        getReplyListData()
    } else {
        return ''
    }
}

const getContent = function(res) {
    let __R = res.__R
    let le = res.__R.length
    let R = __R[le - 1]
    return R.content
}

const creatSendData = function(content) {
    let r = {
        "msgtype": "text",
        "text": {
            "content": content
        },
    }
    return r
}

const handleResponse = function(res) {
    let content = handleContent(res)
    if (content) {
        let sendData = creatSendData(content)
        sendDataByDingDing(sendData).then(response => {
        }).catch(err => {
            logger.error('error', err);
        })
    }
}

const getReplyListData = function() {
    let page = config.readPage
    getReplyList(page).then(response => {
        handleResponse(response)
    }).catch(err => {
        logger.error('error', err);
    })
}

const  scheduleCronstyle = ()=>{
    //每分钟的10, 20, 30, 40, 50, 60秒定时执行一次:
    let rule = new schedule.RecurrenceRule()
    rule.second = [10, 20, 30, 40, 50, 60]
    schedule.scheduleJob(rule,()=>{
        getReplyListData()
    });
}

scheduleCronstyle();
