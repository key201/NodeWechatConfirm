
'use strict'

var Koa = require('koa')
var sha1 = require('sha1')

var config = {
    wechat: {
        AppID:'wx269da7067753d510',
        appSecrect:'4dee19ea03988153dd9d0c1ffaf25d4c',
        token:'key1688634'
    }
}

var app = new Koa()

app.use(function *(next){
    console.log(this.query)

    var reqQuery = this.query

    var token = config.wechat.token
    var signature = reqQuery.signature
    var nonce = reqQuery.nonce
    var timestamp = reqQuery.timestamp
    var echostr = reqQuery.echostr
    var str = [token, timestamp,nonce].sort().join('')
    var sha = sha1(str)
    if (sha===signature){
        this.body = echostr + ''
        console.log('验证成功!'+echostr)
    }else{
        this.body = 'wrong'
    }
})

app.listen(8090)
console.log('Listening: at 8090')
