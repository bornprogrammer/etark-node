// import * as cron from 'node-cron';
// import { orderFailureRepositoryServiceIns } from './modules/order-failure-cron/OrderFailureRepositoryService';
// import { foodyQuestRepositoryServiceIns } from './modules/quest/Foody-quest/FoodyQuestRepositoryService';
// import { questionRepositoryServiceIns } from './modules/fb_conversations/questions/QuestionRepositoryService';

// cron.schedule('*/30 * * * *', async () => {
//     try {
//         console.log('-----------------------------------------start DELETE PENDING ORDERS-------------------------------------------');
//         const cron = await orderFailureRepositoryServiceIns.getPendingOrders();
//         console.log('-----------------------------------------end DELETE PENDING ORDERS-------------------------------------------');
//     } catch (error) {
//         console.log(error);
//     }
// }, {
//     scheduled: true,
// });

// cron.schedule('*/10 * * * *', async () => {
//     try {
//         console.log('-----------------------------------------start Foody Quest Cron-------------------------------------------');
//         const cron = await foodyQuestRepositoryServiceIns.cron();
//         console.log('-----------------------------------------end Foody Quest Cron-------------------------------------------');
//     } catch (error) {
//         console.log(error);
//     }
// }, {
//     scheduled: true,
// });

// cron.schedule('25 19 * * * *', async () => {
//     try {
//         console.log('-----------------------------------------pns start for all verified buddies-------------------------------------------');
//         const cron = await questionRepositoryServiceIns.getMostResponsedQuestion();
//         console.log('-----------------------------------------end Foody Quest Cron-------------------------------------------');
//     } catch (error) {
//         console.log(error);
//     }
// }, {
//     scheduled: true,
// });

// module.exports = cron;
