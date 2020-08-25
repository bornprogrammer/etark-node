import { BaseRepositoryService } from "@app/services/BaseRepositoryService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { serviceCenterActivityRepositoryIns } from "@app/repositories/ServiceCenterActivityRepository";
import { serviceCenterRepositoryIns } from "@app/repositories/ServiceCenterRepository";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";
import { ServiceCenterOrderAttributes } from "@app/models/ServiceCenterOrder";
import { serviceCenterOrderRepositoryIns } from "@app/repositories/ServiceCenterOrderRepository";
import { AddServiceCenterActivityEntity } from "@app/entities/AddServiceCenterActivityEntity";
import { GetServiceCenterOrderListParamsEntity } from "@app/repo-method-param-entities/GetServiceCenterOrderListParamsEntity";
import { ServiceCenterService, serviceCenterServiceIns } from "./ServiceCenterService";

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
        let addServiceCenterOrderDetailsParams: ServiceCenterOrderAttributes = { pickup_delivery_id: topParams.pickup_delivery_id, imei_number: topParams.imei_number, device_front_image: topParams.device_front_image, device_back_image: topParams.device_back_image, phone_warranty: topParams.phone_warranty, service_to_be_done: topParams.service_to_be_done, invoice_total_amount: topParams.invoice_total_amount, proforma_invoice_image: topParams.proforma_invoice_image, due_date: topParams.due_date, final_invoice_image: topParams.final_invoice_image, device_delivery_date: topParams.device_delivery_date };
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

}

export const serviceCenterRepositoryServiceIns = new ServiceCenterRepositoryService();