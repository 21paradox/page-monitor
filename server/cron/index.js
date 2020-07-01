const { CronJob } = require('cron');
const {
  Cron,
  Page,
} = require('../models');

const headUrl = require('./headUrl');

async function init() {
  const delay = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  while (true) {
    const allJobs = await Cron.findAll();
    const result = allJobs.map(async (jobRaw) => {

      const job = jobRaw.toJSON();
      const jobLastRun = job.lastRun;

      let shouldRun = false;
      if (job.jobState === 'running') {
        if (!jobLastRun) {
          shouldRun = true;
        } else {
          if (job.runningInterval === '1hour') {
            if (Date.now() - jobLastRun.getTime() >= 5 * 60 * 1000) {
              shouldRun = true;
            }
          } else if (job.runningInterval === '1day') {
            if (Date.now() - jobLastRun.getTime() >= 24 * 60 * 60 * 1000) {
              shouldRun = true;
            }
          }
        }
      }

      if (!shouldRun) {
        return
      }

      await Cron.update({ lastRun: new Date() }, {
        where: {
          id: job.id,
        }
      });

      const pageInfo = await Page.findOne({
        where: {
          id: job.pageId,
        },
      });
      console.log(pageInfo.toJSON(), 'prepare run');

      return headUrl({
         testUrl: pageInfo.url,
      });
    });

    await Promise.all(result).catch((e) => {
      console.log(e);
    });
    await delay(5000);
  }
}

// init();

module.exports = {
  init
}
