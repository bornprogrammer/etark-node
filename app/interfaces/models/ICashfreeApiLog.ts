export interface ICashfreeApiLog {
    readonly id?: number;
    request: string;
    response: string;
    data?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default ICashfreeApiLog;
