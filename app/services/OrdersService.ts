import { DishesRepository, OrdersRepository } from '@app/repositories';

export default class OrdersService {
    private dishesRepository: DishesRepository;
    private ordersRepository: OrdersRepository;

    public constructor(ordersRepository: OrdersRepository, dishesRepository: DishesRepository) {
        this.dishesRepository = dishesRepository;
        this.ordersRepository = ordersRepository;
    }

    public getBuddyOrdersByMonthYear = (buddyId: number, month: number, year: number) => {
        return this.ordersRepository.findAllOrdersbyBuddyMonthYear(buddyId, month, year);
    }

    public getBuddyOnlinePkOrdersByMonthYear = (buddyId: number, month: number, year: number) => {
        return this.ordersRepository.findOnlinePkOrdersbyBuddyMonthYear(buddyId, month, year);
    }

    public getBuddyOnlineOrdersByMonthYear = (buddyId: number, month: number, year: number) => {
        return this.ordersRepository.findAllOnlineOrdersbyBuddyMonthYear(buddyId, month, year);
    }

    public fixPgChargesInCodOrders = () => {
        return this.ordersRepository.removeOnlineTransactionChargesFromCodOrders();
    }

}
