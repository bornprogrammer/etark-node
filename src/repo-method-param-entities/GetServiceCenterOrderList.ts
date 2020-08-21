import { PaginationStrategy, DBLimit } from "@app/strategies/PaginationStrategy";


export interface GetServiceCenterOrderList {
    activityTypes: string[];
    serviceCenterId: number;
    pagination: DBLimit,
    orderNo : string
}