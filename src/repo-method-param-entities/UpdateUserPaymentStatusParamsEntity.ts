import { in } from "sequelize/types/lib/operators";
import { SrvRecord } from "dns";



export interface UpdateUserPaymentStatusParamsEntity {
    orderNo: string;
    checksum: string;
    paymentStatus: string;
}