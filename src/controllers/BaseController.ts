import MethodCordinator from "@app/coordinators/method-cordinators/MethodCordinator";


export class BaseController {

    protected methodCordinator: MethodCordinator

    constructor(methodCordinator: MethodCordinator) {
        this.methodCordinator = methodCordinator;
    }

}