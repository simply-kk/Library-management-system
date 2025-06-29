const cron = require("node-cron");
const { checkDueDatesAndNotify } = require("../controllers/notificationController");

const setupScheduledJobs = () => {
  // cron.schedule("* * * * *", () => {
  //   console.log(`[CRON] ${new Date().toLocaleString()} - Running due date check...`);
  //   checkDueDatesAndNotify();
  // });
cron.schedule('0 9 * * *', () => { // 9 AM daily
  console.log('Running daily due date check...');
  checkDueDatesAndNotify();
});

};
module.exports = { setupScheduledJobs };

