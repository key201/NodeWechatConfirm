/**
 * Created by Administrator on 2018-11-16.
 */

function foo(param){
    var p = new Promise((resolve, reject) => {
        if (param == 1){
            resolve(param)
        }else{
            reject('invalid value' + param)
        }
    });
    return p
}

foo(1)
    .then((value) => {
    console.log('then-1:'+ value )
    return '2'
})
.then((value) =>{
    console.log('then-2:' + value)
})
.catch ((reason) => {
    console.log('catch:' +reason)
})
