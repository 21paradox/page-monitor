
const puppeteer = require('puppeteer');
const {
  Page,
  Performance,
  Round,
} = require('../models');

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

async function headUrl({ testUrl }) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  try {
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36');
    await page.goto('http://tool.chinaz.com/speedtest/');

    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    // await page.type('#host', testUrl)
    await page.$eval('#host', (el, turl) => { el.value = turl; }, testUrl);
    await page.click('.search-write-btn');

    // await page.screenshot({ path: 'example.png' });
    await sleep(100 * 1000);

    const pageSpeed = await page.evaluate((tUrl) => {
      const resultArr = [];
      const $ = window.jQuery;
      $('#speedlist .row.listw').map((idx, trElem) => {
        const result = {
          location: $(trElem).find('*[name="city"]').text(),
          ip: $(trElem).find('*[name="ip"]').text(),
          status: $(trElem).find('*[name="httpstate"]').text(),
          allTime: $(trElem).find('*[name="alltime"]').text(),
          dnstime: $(trElem).find('*[name="dnstime"]').text(),
          conntime: $(trElem).find('*[name="conntime"]').text(),
          downtime: $(trElem).find('*[name="downtime"]').text(),
          filesize: $(trElem).find('*[name="filesize"]').text(),
          downspeed: $(trElem).find('*[name="downspeed"]').text(),
        };
        resultArr.push(result);
      });
      return resultArr;
    });

    // console.log(pageSpeed);

    if (pageSpeed.length === 0) {
      await browser.close();
      return;
    }

    const [curPage] = await Page.findOrCreate({
      url: testUrl,
      alias: testUrl,
      where: {
        url: testUrl,
      },
    });

    console.log({ curPage });
    const curRound = await Round.create({
      runningAt: new Date(),
    });

    const pageSpeedFmt = [];
    pageSpeed.forEach((v) => {
      const fmtTime = (timeStr) => {
        let timeParsed;
        timeStr = timeStr.replace('<', '');
        if (timeStr.match(/ms$/)) {
          timeParsed = parseFloat(timeStr.replace(/ms$/, ''));
        }
        if (isNaN(timeParsed)) {
          timeParsed = null;
        }
        return timeParsed;
      };

      const result = {
        ...v,
        allTime: fmtTime(v.allTime),
        dnstime: fmtTime(v.dnstime),
        conntime: fmtTime(v.conntime),
        downtime: fmtTime(v.downtime),
        pageId: curPage.id,
        roundId: curRound.id,
      };
      pageSpeedFmt.push(result);
    });

    await Performance.bulkCreate(pageSpeedFmt);
    // console.log({
    //   pageSpeedFmt,
    // });
    // fs.writeFileSync('./result.json', JSON.stringify(pageSpeed, null, 4))
    await browser.close();

  } catch (e) {
    await browser.close();
  }

}

// headUrl({
//   testUrl: 'https://baidu.com'
// })


module.exports = headUrl;

