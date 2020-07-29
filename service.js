

const {getReplyList, sendDataByDingDing} = require("./api/index");
const schedule = require('node-schedule');
const log4js = require('log4js');
const loggerConfig = require('./config/logger.json');

log4js.configure(loggerConfig);
const logger = log4js.getLogger('custom-category');

let config = {
    // 当前页数
    currentPage: 253,
    // 当前条数
    currentRows: 5041,
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

const cutString = function(content, str1, str2) {
    let le1 = str1.length
    // let le2 = str2.length
    let r = ''
    let index1 = content.indexOf(str1) + le1
    if (str1 && str2) {
        let index2 = content.indexOf(str2)
        if (index1 >= 0 && index2 >= 0) {
            r = content.slice(index1, index2)
        }
    } else if (str1) {
        if (index1 >= 0) {
            r = content.slice(index1)
        }
    }

    return r
}

const transformationContentType = function(content) {
    let quote = cutString(content, '[quote]', '[/quote]')
    let replyContent = ''
    let r = ''
    let br = new RegExp('<br/>','g')
    if (quote) {
        let quoteByContent = cutString(content, '[b]', '[/b]')
        let quoteName = cutString(quoteByContent, ']', '[/uid]')
        let quoteTime = cutString(quoteByContent, '(', ')')
        let quoteContent = cutString(quote, '[/b]').replace(br,'\n> ')
        replyContent = cutString(content, '[/quote]').replace(br,'\n')
        r = `#### 回复: ${quoteName}(${quoteTime}) \n> ${quoteContent}${replyContent}`
    } else {
        replyContent = content.replace(br, '/n')
        r = `${replyContent}`
    }
    console.log('r', r)
    return r
}
const creatSendData = function(content) {
    let text = transformationContentType(content)
    let r = {
        "msgtype": "markdown",
        "markdown": {
            "title":`当前页:${config.currentPage}当前条:${config.currentRows}`,
            "text": text
        },
    }
    return r
}

const handleResponse = function(res) {
    let content = handleContent(res)
    if (content) {
        let sendData = creatSendData(content)
        console.log('sendData', sendData)
        getSendDataByDingDing(sendData)
    }
}
const getSendDataByDingDing = function (data) {
    sendDataByDingDing(data).then(response => {
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
