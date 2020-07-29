

const {getReplyList, sendDataByDingDing} = require("./api/index");
const schedule = require('node-schedule');
const log4js = require('log4js');
const loggerConfig = require('./config/logger.json');

log4js.configure(loggerConfig);
const logger = log4js.getLogger('custom-category');

let config = {
    // 当前页数
    currentPage: 250,
    // 当前条数
    currentRows: 4988,
}

const updateConfig = function () {
    // 发送消息成功, 准备下一次的config
    let currentRows = config.currentRows
    if (currentRows % 20 === 0) {
        config.currentPage += 1
    }
    config.currentRows += 1
}

const handleContent = function(res) {
    let result = ''
    let totalRows = res.__ROWS
    let currentRows = config.currentRows
    let currentRow = currentRows % 20
    if (currentRow === 0) {
        currentRow = 20
    }
    if (currentRows < totalRows + 1) {
        result = getContent(res, currentRow -1)
    }
    return  result
}

const getContent = function(res, row) {
    let __R = res.__R
    let R = __R[row]
    return R.content
}

const creatSendData = function(content) {
    content = `currentPage:${config.currentPage}currentRows:${config.currentRows}_____${content}`
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
        getSendDataByDingDing(sendData)
    }
}
const getSendDataByDingDing = function (data) {
    sendDataByDingDing(data).then(response => {
        console.log('response', response)
        console.log('response', response)
        updateConfig()
    }).catch(err => {
        logger.error('error', err);
    })
}

const getReplyListData = function() {
    let page = config.currentPage
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
