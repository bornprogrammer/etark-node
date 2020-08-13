import { EventEmitter } from 'events';
import { EventEmitterIdentifierEnum } from '@app/enums/EventEmitterIdentifierEnum';
import MethodCoordinator from '@app/coordinators/method-cordinators/MethodCordinator';

export abstract class BaseEventEmitter extends EventEmitter {

    constructor(eventName: EventEmitterIdentifierEnum) {
        super();
        this.on(eventName, this.handle);
    }

    public getMethodCoordinator(): MethodCoordinator {
        return new MethodCoordinator();
    }

    public abstract async handle(data?: any);

}
