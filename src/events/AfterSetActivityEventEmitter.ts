import { BaseQueue } from "./BaseQueue";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";


export class AfterSetActivityEventEmitter extends BaseQueue {


    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum.AFTER_SET_ACTIVITY_EVENTEMITTER);
    }

    public async handleJob(data?: any) {
        let params = data;
    }

    
}

export const afterSetActivityEventEmitterIns = new AfterSetActivityEventEmitter();