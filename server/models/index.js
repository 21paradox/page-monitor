
const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('scan_monitor', 'root', 'my-secret-pw', {
  // host: 'localhost',
  host: '121.36.13.244',
  port: '3306',
  dialect: 'mysql',
  define: {
    timestamps: false,
    charset: 'utf8mb4',
  },
});

const Page = sequelize.define('page', {
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  alias: {
    type: Sequelize.STRING,
  },
}, {
  sequelize,
  // modelName: 'page'
});

const Round = sequelize.define('round', {
  runningAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  // modelName: 'round'
});

const Performance = sequelize.define('performance', {
  location: {
    type: Sequelize.STRING,
  },
  ip: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
  allTime: {
    type: Sequelize.FLOAT,
  },
  dnstime: {
    type: Sequelize.FLOAT,
  },
  conntime: {
    type: Sequelize.FLOAT,
  },
  downtime: {
    type: Sequelize.FLOAT,
  },
  detail: {
    type: Sequelize.TEXT,
  },
  filesize: {
    type: Sequelize.STRING,
  },
  downspeed: {
    type: Sequelize.STRING,
  },
}, {
  sequelize,
  // modelName: 'performance'
});

Performance.belongsTo(Page, { as: 'page' });
Performance.belongsTo(Round, { as: 'round' });

const Cron = sequelize.define('cron', {
  jobName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  jobState: {
    type: Sequelize.ENUM('running', 'stopped'),
    allowNull: false,
  },
  runningInterval: {
    type: Sequelize.ENUM('1hour', '1day'),
    allowNull: false,
  },
  lastRun: {
    type: Sequelize.DATE,
  },
}, {
  sequelize,
  // modelName: 'cron'
});

Cron.belongsTo(Page, { as: 'page' });
Cron.belongsTo(Round, { as: 'lastRound' });

// sequelize.sync({ force: true }).then(() => {
//   console.log('sync schema done')
// })

module.exports = {
  Page,
  Round,
  Performance,
  Cron,
  sequelize,
};
