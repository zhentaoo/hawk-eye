let rq = require('request-promise');
let date = Math.random();

let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8360/monitor',
    body: {
      state: 'error',
      img: `ZT-${date}.png`,
    },
    json: true
};

rq(options).then(res => console.log(res)).catch(err => console.log(err))
