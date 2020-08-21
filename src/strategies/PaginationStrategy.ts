import { Request } from "express";

export class PaginationStrategy {

    constructor() {
    }

    public extractOutPaginationParams = async (req: Request): Promise<DBLimit> => {
        let pageNo: any = req.query['page_no'] || 1;
        let noOfRecords: any = req.query['no_of_records'] || 10;
        let dbLimit: DBLimit = { limit: noOfRecords, offset: 0 };
        dbLimit.offset = (pageNo - 1) * noOfRecords;
        return dbLimit;
    }

    public extractOutPaginationParamsNMerge = async (req: Request, obj: any) => {
        let paginationParams = await this.extractOutPaginationParams(req);
        return Object.assign(obj, paginationParams);
    }
}

export const paginationStrategyIns = new PaginationStrategy();

export interface DBLimit {
    limit: number;
    offset: number;
}