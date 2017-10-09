const puppeteer = require('puppeteer');
let {timeout, moment} = require('./tools.js');
let rq = require('request-promise');
var child_process = require('child_process');

function monitor() {
    console.log('puppeteer launch...');

    console.log('start del data/success...');
    child_process.spawnSync('rm', ['-rf', './data/success']);

    console.log('del data/success success...');

    puppeteer.launch({headless: false}).then(async browser => {
        child_process.spawnSync('mkdir', ['./data/success']);

        let page = await browser.newPage();
        let date = moment("Y-M-DTh:m:s");

        // 进入网站后，等待五秒
        console.log('goto the site');
        await page.goto('http://www.zhentaoo.com/');
        await timeout(3000);

        // 取出首页的文章title，如果有title为空，则截图存入err，截图会长期保留
        // 并且请求接口，记录本次错误，然后结束本次任务
        console.log('get the post title: ');
        let info = await page.evaluate(() => {
            let post = [...document.querySelectorAll('.post-title')];
            return post.map((a) => a.innerText);
        });

        console.log(JSON.stringify(info));

        let options = {
            method: 'POST',
            uri: 'http://127.0.0.1:8360/monitor',
            body: {
              img: `ZT-${date}.png`,
              state: 'error'
            },
            json: true
        };

        // for循环，如果有渲染不正常的，则请求接口，保存图片
        for (let i = 0; i < info.length; i++) {
          if (!info[i]) {
            console.log('there may be an error on the site!!!');
            await rq(options);
            await page.screenshot({path: `./data/err/ZT-${date}.png`, type: 'png'});

            console.log('puppeteer end...');
            browser.close();
            return;
          }
        }

        // 如果正常则发送请求，截图并删除之前的图片，结束任务
        options.body.state = 'success'
        await rq(options);

        console.log('the site is well');
        await page.screenshot({path: `./data/success/ZT-${date}.png`, type: 'png'});
        console.log('puppeteer end...');
        browser.close();
    });
}

monitor();
setInterval(monitor, 1000 * 60 * 5);
