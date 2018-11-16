
var http = require('http')
var server = http.createServer()
var url = require('url')
var sha1 = require('sha1')

var mapURL = 'http://key168863.iok.la/'
var tokenKey = 'key168863'
var EncodingAESKey='8BznyBwMGSHWgITQlCgOV0KtsPePjDGUajU6SO9gmS7'
var config = {
    wechat: {
        AppID:'wx269da7067753d510',
        appSecrect:'4dee19ea03988153dd9d0c1ffaf25d4c',
        token:'key168863'


    }
}


server.on('request', function (req,res) {
    var obj = url.parse(req.url,true)
    console.log(obj.query)
    //if (req.url='/'){
    //    res.end('helloword')
    //}
    var reqQuery = obj.query

    var token = config.wechat.token
    var signature = reqQuery.signature
    var nonce = reqQuery.nonce
    var timestamp = reqQuery.timestamp
    var echostr = reqQuery.echostr
    var str = [token, timestamp,nonce].sort().join('')
    var sha = sha1(str)
    if (sha===signature){
        res.end(reqQuery.echostr)
    }else{
        res.end('confirm wrong')
    }

    //echostr: '8657140197
    //timestamp: '15419363
    //nonce: '1703468527'

})

server.listen(8090, function(){
    console.log('server 8090 is running.......')
})