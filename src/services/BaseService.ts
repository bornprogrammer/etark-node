
import MethodCoordinator from "@app/coordinators/method-cordinators/MethodCordinator";

export default abstract class BaseService {

    constructor() {

    }

    public getMethodCoordinator(): MethodCoordinator {
        return new MethodCoordinator();
    }
}
