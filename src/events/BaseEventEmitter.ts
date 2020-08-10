import { EventEmitter } from 'events';
import { EventEmitterIdentifierEnum } from '@app/enums/EventEmitterIdentifierEnum';

export abstract class BaseEventEmitter extends EventEmitter {

    constructor(eventName: EventEmitterIdentifierEnum) {
        super();
        this.on(eventName, this.handle);
    }

    public abstract async handle(data?: any);

}
