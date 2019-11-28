import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';
import AccountTransaction from './AccountTransaction';
import BuddyAccountTransaction from './BuddyAccountTransaction';
import BuddyPayoutCronJob from './BuddyPayoutCronJob';
import BuddyPayoutMissingAccount from './BuddyPayoutMissingAccount';
import BuddyWallet from './BuddyWallet';
import CashfreeApiLog from './CashfreeApiLog';
import CashfreeBatchPayout from './CashfreeBatchPayout';
import CashfreeBuddyPayout from './CashfreeBuddyPayout';
import Dish from './Dish';
import Order from './Order';
import PrivateKitchen from './PrivateKitchen';
import PrivateKitchenPlan from './PrivateKitchenPlan';
import PrivateKitchenPlanHubPrice from './PrivateKitchenPlanHubPrice';
import PrivateKitchenSubscription from './PrivateKitchenSubscription';
import User from './User';
import UserAccount from './UserAccount';
import UserAccountOld from './UserAccountOld';
import UserBankAccount from './UserBankAccount';
import UserPaytmAccount from './UserPaytmAccount';
import UserSession from './UserSession';

// import CustomMenu from '@app/modules/custom-menus/CustomMenuModel'
// import CustomMenuDishes from '@app/modules/custom-menus/CustomMenuDishesModel'

const db = {
    sequelize,
    Sequelize,
    Order,
    Dish,
    User,
    UserAccount,
    UserAccountOld,
    UserSession,
    AccountTransaction,
    BuddyAccountTransaction,
    PrivateKitchen,
    PrivateKitchenSubscription,
    PrivateKitchenPlanHubPrice,
    PrivateKitchenPlan,
    BuddyWallet,
    BuddyPayoutCronJob,
    BuddyPayoutMissingAccount,
    CashfreeApiLog,
    CashfreeBatchPayout,
    CashfreeBuddyPayout,
    UserBankAccount,
    UserPaytmAccount,
};

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

export default db;

// middleware setup done, authemntication, validation
