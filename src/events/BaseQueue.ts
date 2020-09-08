

import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { BaseEventEmitter } from "./BaseEventEmitter";
import ArrayHelper from "@app/helpers/ArrayHelper";

export abstract class BaseQueue extends BaseEventEmitter {

    constructor(eventName: EventEmitterIdentifierEnum) {
        super(eventName);
    }

    public emit(event: string | symbol, ...args: any[]): boolean {
        setTimeout(() => {
            return super.emit(event, args);
        }, this.getQueueTime());
        return true;
    }

    protected getQueueTime() {
        return 3000;
    }

    public async handle(data?: any) {
        try {
            data = ArrayHelper.isArrayValid(data) ? data[0] : null;
            await this.handleJob(data);
        } catch (error) {
            console.log('error under queue handler', error);
        }
    }
    public abstract async handleJob(data?: any);

}