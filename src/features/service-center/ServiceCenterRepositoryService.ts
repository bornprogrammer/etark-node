import { BaseRepositoryService } from "@app/services/BaseRepositoryService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { serviceCenterActivityRepositoryIns } from "@app/repositories/ServiceCenterActivityRepository";
import { serviceCenterRepositoryIns } from "@app/repositories/ServiceCenterRepository";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";
import { ServiceCenterOrderAttributes } from "@app/models/ServiceCenterOrder";
import { serviceCenterOrderRepositoryIns } from "@app/repositories/ServiceCenterOrderRepository";
import { AddServiceCenterActivityEntity } from "@app/entities/AddServiceCenterActivityEntity";
import { GetServiceCenterOrderListParamsEntity } from "@app/repo-method-param-entities/GetServiceCenterOrderListParamsEntity";
import { serviceCenterServiceIns } from "./ServiceCenterService";
import { afterSetActivityEventEmitterIns } from "@app/events/AfterSetActivityEventEmitter";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import BadHttpRequestError from "@app/errors/BadHttpRequestError";
import { deviceDispatchDetailsRepositoryIns } from "@app/repositories/DeviceDispatchDetailsRepository";
import UnAuthorized from "@app/errors/UnAuthorized";

export class ServiceCenterRepositoryService extends BaseRepositoryService {
    /**
     *
     */
    constructor() {
        super();
    }

    public getOrderList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let serviceCenterOrderList: GetServiceCenterOrderListParamsEntity = { activityTypes: await serviceCenterServiceIns.getServiceCenterActivityTypeByOrderType(params.activity_type), orderNo: params.order_no, pagination: params.pagination, serviceCenterId: params.sc_id };
        let result = await serviceCenterRepositoryIns.getServiceCenterOrderList(serviceCenterOrderList);
        return result;
    }

    public processServiceCenterOrderDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.addServiceCenterOrderDetails, callableFunctionParams: params }).setMethod({ callableFunction: this.addUserToConfirmServiceCenterActivity }).coordinate();
        return result;
    }

    public addServiceCenterOrderDetails = async (methodParamEntity: MethodParamEntity) => {
        let topParams = methodParamEntity.topMethodParam;
        let addServiceCenterOrderDetailsParams: ServiceCenterOrderAttributes = { pickup_delivery_id: topParams.pickup_delivery_id, imei_number: topParams.imei_number, device_front_image: topParams.device_front_image, device_back_image: topParams.device_back_image, phone_warranty: topParams.phone_warranty, service_to_be_done: topParams.service_to_be_done, invoice_total_amount: topParams.invoice_total_amount, proforma_invoice_image: topParams.proforma_invoice_image, due_date: topParams.due_date, device_delivery_date: topParams.device_delivery_date };
        let result = await serviceCenterOrderRepositoryIns.create(addServiceCenterOrderDetailsParams);
        return result
    }

    public addUserToConfirmServiceCenterActivity = async (methodParamEntity: MethodParamEntity) => {
        let addServiceCenterOrderDetails = methodParamEntity.topMethodParam;
        let result = await this.addServiceCenterActivity({ activityType: ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM, pickupDeliveryId: addServiceCenterOrderDetails.pickup_delivery_id });
        return result;
    }

    public addAllocatedServiceCenterActivity = async (pickupDeliveryId: number) => {
        let result = await this.addServiceCenterActivity({ activityType: ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED, pickupDeliveryId: pickupDeliveryId });
        return result;
    }

    public addServiceCenterActivity = async (params: AddServiceCenterActivityEntity) => {
        let result = await serviceCenterActivityRepositoryIns.create({ activity_type: params.activityType, pickup_delivery_id: params.pickupDeliveryId });
        return result;
    }

    public setActivity = async (params: MethodParamEntity) => {
        let topMethodParam = params.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.isLastDBActivityValid, callableFunctionParams: topMethodParam }).setMethod({ callableFunction: this.setCurrentActivity, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.afterSetActivity }).coordinate();
        return result
    }

    public isLastDBActivityValid = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let lastActivity = await serviceCenterServiceIns.getServiceCenterLastActivityType(topParams.activity_type);
        let allServiceCenterActivities = await serviceCenterRepositoryIns.getServiceCenterAllActivitiesDetails({ pickupDeliveryId: topParams.pickup_delivery_id });
        let isLastActivityValid = await serviceCenterServiceIns.isLastDBActivityValid(allServiceCenterActivities, lastActivity);
        if (!isLastActivityValid) {
            throw new BadHttpRequestError();
        }
        return isLastActivityValid;
    }

    public setCurrentActivity = async (param: MethodParamEntity) => {
        let topParams = param.topMethodParam;
        let result = await this.addServiceCenterActivity({ activityType: topParams.activity_type, pickupDeliveryId: topParams.pickup_delivery_id });
        return result;
    }

    public removeServiceCenter = async (pickupDeliveryId: number) => {
        await serviceCenterActivityRepositoryIns.removeServiceCenter(pickupDeliveryId);
    }

    public afterSetActivity = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        if (topParams.activity_type === ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED) {
            this.removeServiceCenter(topParams.pickup_delivery_id);
        }
        afterSetActivityEventEmitterIns.emit(EventEmitterIdentifierEnum.AFTER_SET_ACTIVITY_EVENTEMITTER, params.topMethodParam);
    }

    public assignAnotherServiceCenter = async () => {
    }

    public addDispatchDetail = async (params: MethodParamEntity) => {
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.createDispatchDetails, callableFunctionParams: params.topMethodParam }).setMethod({ callableFunction: this.addReadyToDispatchActivity }).coordinate();
        return result;
    }

    public createDispatchDetails = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await deviceDispatchDetailsRepositoryIns.create({ pick_delivery_id: topParams.pickup_delivery_id, device_back_image: topParams.device_back_image, device_front_image: topParams.device_front_image, final_invoice_image: topParams.final_invoice_image });
        console.log("result", result);
        return result;
    }

    public addReadyToDispatchActivity = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await this.addServiceCenterActivity({ activityType: ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH, pickupDeliveryId: topParams.pickup_delivery_id });
        return result;
    }

    public login = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await serviceCenterRepositoryIns.login({ email: topParams.email, password: topParams.password });
        if (!result) {
            throw new UnAuthorized();
        }
        return result;
    }

    public getOrderTrends = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = {
            total_order: 45,
            total_order_percentage: 2.98,
            order_ongoing: 14,
            order_ongoing_percentage: -1.09,
            order_completed: 22,
            order_completed_percentage: -5.48
        }
        return result;
    }

    public doesSCExists = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await serviceCenterRepositoryIns.doesSCExistsByCityIdNMakerId({ cityId: topParams.city_id, makerId: topParams.maker_id });
        let finalResult = { does_sc_exists: result ? true : false };
        return finalResult;
    }
}

export const serviceCenterRepositoryServiceIns = new ServiceCenterRepositoryService();