import { PaginationStrategy, DBLimit } from "@app/strategies/PaginationStrategy";


export interface GetServiceCenterOrderListParamsEntity {
    activityTypes: string[];
    serviceCenterId: number;
    pagination: DBLimit,
    orderNo : string
}