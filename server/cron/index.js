const { CronJob } = require('cron');
const {
  Cron,
  Page,
} = require('../models');

const headUrl = require('./headUrl');

async function init() {
  const allJobs = await Cron.findAll();

  allJobs.forEach(async (jobRaw) => {
    const job = jobRaw.toJSON();

    if (job.jobState === 'running') {
      let setTime;
      if (job.runningInterval === '1hour') {
        setTime = '0 * * * *';
      } else if (job.runningInterval === '1hour') {
        setTime = '0 0 * * *';
      }

      const pageInfo = await Page.findOne({
        where: {
          id: job.page_id,
        },
      });
      console.log(pageInfo.toJSON());

      let round = 0;
      const cronJob = new CronJob(
        setTime,
        (() => {
          round += 1;
          if (round > 1) {
            return;
          }
          // console.log('message');
          console.log(pageInfo.url, 'aa');
          headUrl({
            testUrl: pageInfo.url,
          });
        }),
        null,
        true,
        'Asia/Hong_Kong',
      );
    }
  });
}

// init();


module.exports = {
  init
}
