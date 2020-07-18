// import BaseController from '@app/controllers/BaseController';
// import AccountsService from '@app/services/AccountsService';
// import OrdersService from '@app/services/OrdersService';
// import {Request, Response} from 'express';

// export class BuddiesController extends BaseController {

//     private ordersService: OrdersService;
//     private accountsService: AccountsService;

//     constructor(ordersService: OrdersService, accountsService: AccountsService) {
//         super();
//         this.ordersService = ordersService;
//         this.accountsService = accountsService;
//     }

//     public getOrders = async (req: any, res: Response, next) => {
//         try {

//             // in future we will have a check for admin role here
//             if (req.user.id !== Number(req.params.buddyUserId)) {
//                 return this.errorResponse(res, this.FORBIDDEN);
//             }

//             if (!req.query.ordersType) {
//                 return this.errorResponse(
//                     res,
//                     this.BAD_REQUEST,
//                     'Missing mandatory query string param ordersType',
//                 );
//             }

//             let orders = [];
//             if (req.query.ordersType === 'pkOnlineOrders') {
//                 orders = await this.ordersService.getBuddyOnlinePkOrdersByMonthYear(
//                     req.params.buddyUserId,
//                     req.query.month,
//                     req.query.year,
//                 );
//             } else if (req.query.ordersType === 'allOrders') {
//                 orders = await this.ordersService.getBuddyOrdersByMonthYear(
//                     req.params.buddyUserId,
//                     req.query.month,
//                     req.query.year,
//                 );
//             } else if (req.query.ordersType === 'allOnlineOrders') {
//                 orders = await this.ordersService.getBuddyOnlineOrdersByMonthYear(
//                     req.params.buddyUserId,
//                     req.query.month,
//                     req.query.year,
//                 );
//             } else {
//                 return this.errorResponse(
//                     res,
//                     this.BAD_REQUEST,
//                     'Invalid param value for ordersType query string param',
//                 );
//             }
//             return this.successResponse(res, '', {orders});
//         } catch (error) {
//             next(error);
//         }
//     }

//     public getAccount = async (req: any, res: Response, next) => {
//         try {
//             // in future we will have a check for admin role here
//             if (req.user.id !== Number(req.params.buddyUserId)) {
//                 return this.errorResponse(res, this.FORBIDDEN);
//             }

//             let account;
//             if (req.query.updated === 'true') {
//                 account = await this.accountsService.getUpdatedAccSummary(req.params.buddyUserId);
//             } else {
//                 account = await this.accountsService.getAccountSummaryByUserId(req.params.buddyUserId);
//             }

//             if (!account) {
//                 return this.errorResponse(res, this.NOT_FOUND, 'Resource not found', {});
//             }
//             return this.successResponse(res, '', {account});
//         } catch (error) {
//             next(error);
//         }
//     }
// }
