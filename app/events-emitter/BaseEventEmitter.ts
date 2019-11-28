import { EventEmitter } from 'events';

export abstract class BaseEventEmitter extends EventEmitter {

    constructor(eventName: string) {
        super();
        this.on(eventName, this.handle);
    }

    public abstract async handle(data?: any);

}
