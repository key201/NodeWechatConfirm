'use strict'

var sha1 = require('sha1')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))

var prefix = 'https://api.weixin.qq.com/cgi-bin/'

var api = {
    accessToken: prefix + 'token?grant_type=client_credential'
}


function Wechat(opts){
    var  that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    this.getAccessToken()
        .then(function(data){
            try{
                data = JSON.parse(data)
                console.log(data)
            }
            catch (e){
                return that.updateAccessToken()
            }
            if (that.isValidAccessToken(data)){
                return Promise.resolve(data)
            } else {
                return that.updateAccessToken()
            }
        })
        .then(function(data) {
            //console.log('into second then data')
            //console.log(data)
            that.access_token = data.access_token
            that.expires_in = data.expires_in

            that.saveAccessToken(data)
        })
}

Wechat.prototype.isValidAccessToken = function(data){
    if (!data || !data.access_token || !data.expires_in){
        return false
    }
    //var access_token = data.access_token
    var expires_in = data.expires_in
    var now = (new Date().getTime())

    if (now<expires_in){
        return true
    }else {
        return false
    }
}
//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
Wechat.prototype.updateAccessToken = function(){
    var appID = this.appID
    var appSecret = this.appSecret
    //&appid=APPID&secret=APPSECRET
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret
    //console.log(url)
    return new Promise(function(resolve, reject){
        request({url:url, json:true}).then(function(response){
            //console.log(response)
            var data = response.body
            //var data = response[1]
            var now = (new Date().getTime())
            var  expires_in = now + (data.expires_in - 20) * 1000

            data.expires_in = expires_in
            resolve(data)
        })
    })
}

module.exports = function(opts){

    var wechat = new Wechat(opts)

    return function *(next) {
        console.log(this.query)

        var reqQuery = this.query

        var token = opts.token
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
            this.body = 'Today is wrong  data'
        }
    }
}
