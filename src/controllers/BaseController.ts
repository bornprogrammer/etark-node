import MethodCoordinator from "@app/coordinators/method-cordinators/MethodCordinator";
import BaseService from "@app/services/BaseService";
import { CtrlMethodCoordinator } from "@app/coordinators/method-cordinators/CtrlMethodCoordinator";


export class BaseController {

    constructor() {

    }

    public getCtrlMethodCoordinator(): CtrlMethodCoordinator {
        return new CtrlMethodCoordinator();
    }


}