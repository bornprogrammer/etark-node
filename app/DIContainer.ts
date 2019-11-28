import { BuddiesController as V1BuddiesController } from '@app/controllers/v1';
import { CashfreeController } from './controllers/v1/CashfreeController';
import {
    AccountTransactionsRepository,
    BuddyAccountTransactionsRepository,
    BuddyPayoutCronJobsRepository,
    BuddyPayoutMissingAccountsRepository,
    BuddyWalletRepository,
    CashfreeBuddyPayoutRepository,
    DishesRepository,
    OrdersRepository,
    PrivateKitchensRepository,
    PrivateKitchenSubscriptionsRepository,
    UserAccountsRepository,
    UserSessionsRepository,
} from './repositories';
import { CashfreeApiLogRepository } from './repositories/CashfreeApiLogRepository';
import { CashfreeBatchPayoutRepository } from './repositories/CashfreeBatchPayoutRepository';
import { OldUserAccountsRepository } from './repositories/OldUserAccountsRepository';
import AccountsScriptService from './services/AccountsScriptService';
import AccountsService from './services/AccountsService';
import AuthMiddleware from './services/AuthMiddleware';
import BuddyPayoutService from './services/BuddyPayoutService';
import CashfreeService from './services/CashfreeService';
import OrdersService from './services/OrdersService';
import TestService from './services/TestService';

// importing custom menu modules
import CustomMenuController from '@app/modules/custom-menus/CustomMenuController';
import CustomMenuRepository from '@app/modules/custom-menus/CustomMenuRepository';
import CustomMenuPostController from './modules/custom-menus/custom-menu-post/CustomMenuPostController';
import CustomMenuPostRepository from './modules/custom-menus/custom-menu-post/CustomMenuPostRepository';
import CustomMenuPostRepositoryService from './modules/custom-menus/custom-menu-post/CustomMenuPostRepositoryService';
import CustomMenuRepositoryService from './modules/custom-menus/CustomMenuRepositoryService';
import ResponseService from './response-handler/ResponseService';

class DIContainer {

    // repositories ?? why is this made read only
    public readonly userAccountsRepository = new UserAccountsRepository();
    public readonly dishesRepository = new DishesRepository();
    public readonly ordersRepository = new OrdersRepository();
    public readonly userSessionsRepository = new UserSessionsRepository();
    public readonly accountTransactionsRepository = new AccountTransactionsRepository();
    public readonly buddyAccountTransactionsRepository = new BuddyAccountTransactionsRepository();
    public readonly privateKitchensRepository = new PrivateKitchensRepository();
    public readonly privateKitchenSubscriptionsRepository = new PrivateKitchenSubscriptionsRepository();
    public readonly buddyWalletRepository = new BuddyWalletRepository();
    public readonly buddyPayoutCronJobsRepository = new BuddyPayoutCronJobsRepository();
    public readonly cashfreeBuddyPayoutRepository = new CashfreeBuddyPayoutRepository();
    public readonly buddyPayoutMissingAccountsRepository = new BuddyPayoutMissingAccountsRepository();
    public readonly cashfreeBatchPayoutRepository = new CashfreeBatchPayoutRepository();
    public readonly cashfreeApiLogRepository = new CashfreeApiLogRepository();
    public readonly oldUserAccountsRepository = new OldUserAccountsRepository();

    // services
    public accountsService = new AccountsService(
        this.userAccountsRepository,
        this.ordersRepository,
    );
    public ordersService = new OrdersService(this.ordersRepository, this.dishesRepository);
    public cashfreeService = new CashfreeService(this.cashfreeApiLogRepository);
    public buddyPayoutService = new BuddyPayoutService(
        this.buddyPayoutCronJobsRepository,
        this.userAccountsRepository,
        this.cashfreeBuddyPayoutRepository,
        this.buddyPayoutMissingAccountsRepository,
        this.cashfreeBatchPayoutRepository,
        this.buddyAccountTransactionsRepository,
        this.oldUserAccountsRepository,
        this.accountTransactionsRepository,
        this.cashfreeService,
    );

    // services
    //   public ordersService = new OrdersService(this.ordersRepository, this.dishesRepository);
    // public readonly responseService = new ResponseService();
    // controllers
    public authMiddleware = new AuthMiddleware(this.userSessionsRepository);
    public cashfreeController = new CashfreeController(this.buddyPayoutService);

    private testServiceInstance = null;
    private accountScriptServiceInstance = null;

    /*
     * following services are not required in app server for processing api requests
     * and these are only required for testing or cron jobs
     * hence, we lazy load these services
     */
    public testService = () => {
        if (!this.testServiceInstance) {
            this.testServiceInstance = new TestService(this.userAccountsRepository);
        }
        return this.testServiceInstance;
    }

    public accountsScriptService = () => {
        if (!this.accountScriptServiceInstance) {
            this.accountScriptServiceInstance = new AccountsScriptService(
                this.userAccountsRepository,
                this.ordersRepository,
                this.accountTransactionsRepository,
                this.buddyAccountTransactionsRepository,
                this.privateKitchensRepository,
                this.privateKitchenSubscriptionsRepository,
                this.buddyWalletRepository,
            );
        }
        return this.accountScriptServiceInstance;
    }

}

export default new DIContainer();
