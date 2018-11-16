'use strict'

var path = require('path')
var util = require('./libs/util')
var Koa = require('koa')
var wechat = require('./g')

var wechat_file = path.join(__dirname, './config/wechat.txt')

var config = {
    wechat: {
        appID:'wx269da7067753d510',
        appSecret:'d1daf0a4845c30827999d9cdbba7566a',
        token:'key1688634',
        getAccessToken:function() {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken:function(data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file, data)
        }
    }
}

var app = new Koa()

app.use(wechat(config.wechat))

app.listen(8090)
console.log('Listening: at 8090')
