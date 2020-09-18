
import MethodCoordinator from "@app/coordinators/method-cordinators/MethodCordinator";

export abstract class BaseRepositoryService {

    constructor() {
    }

    public getMethodCoordinator(): MethodCoordinator {
        return new MethodCoordinator();
    }
}