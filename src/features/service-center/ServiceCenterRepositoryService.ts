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
import { ServiceCenterOrderTypeEnum } from "@app/enums/ServiceCenterOrderTypeEnum";
import ArrayHelper from "@app/helpers/ArrayHelper";
import { Complaint } from "@app/models/Complaint";
import { pickupDeliveyRepositoryIns } from "@app/repositories/PickupDeliveyRepository";
import { PhoneWarrantyTypeEnum } from "@app/enums/PhoneWarrantyTypeEnum";

export class ServiceCenterRepositoryService extends BaseRepositoryService {
    /**
     *
     */
    constructor() {
        super();
    }

    public getOrderList = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = null;
        if (params.order_type === ServiceCenterOrderTypeEnum.ORDER_TYPE_ALL) {
            result = await this.getOrderListForAllType(params);
        } else {
            result = await this.getOrderListByOrderType(params);
        }
        result = await this.convertOrderListResponse(result);
        return result;
    }

    public getOrderListByOrderType = async (topParams: any) => {
        let lastActivityIds = await serviceCenterRepositoryIns.getLastActivityIds(topParams.sc_id);
        let lastActivityIdArr = ArrayHelper.extractKeyFromArrayOfObject(lastActivityIds, 'activity_id');
        let activityTypes = await serviceCenterServiceIns.getServiceCenterActivityTypeByOrderType(topParams.order_type);
        let serviceCenterOrderList: GetServiceCenterOrderListParamsEntity = { activityTypes: activityTypes, orderNo: topParams.order_no, pagination: topParams.pagination, serviceCenterId: topParams.sc_id, activityIds: lastActivityIdArr };
        let result = await serviceCenterRepositoryIns.getServiceCenterOrderList(serviceCenterOrderList);
        return result;
    }

    public getOrderListForAllType = async (topParams: any) => {
        let lastActivityIds = await serviceCenterRepositoryIns.getFirstActivityIds(topParams.sc_id);
        let lastActivityIdArr = ArrayHelper.extractKeyFromArrayOfObject(lastActivityIds, 'activity_id');
        let activityTypes = await serviceCenterServiceIns.getServiceCenterActivityTypeByOrderType(topParams.order_type);
        let serviceCenterOrderList: GetServiceCenterOrderListParamsEntity = { activityTypes: activityTypes, orderNo: topParams.order_no, pagination: topParams.pagination, serviceCenterId: topParams.sc_id, activityIds: lastActivityIdArr };
        let result = await serviceCenterRepositoryIns.getServiceCenterOrderList(serviceCenterOrderList);
        return result;
    }

    private convertOrderListResponse = async (orderListResponse: Complaint[]) => {
        let newOrderListResponse = null;
        if (ArrayHelper.isArrayValid(orderListResponse)) {
            newOrderListResponse = [];
            orderListResponse.forEach((complain) => {
                let complainDetails = { complainId: complain.id, maker_detail_id: complain.maker_detail_id, complainDetail: {}, serviceCenterOrderDetails: {}, deviceDispatchDetail: {}, userPaymentDetails: {}, orderDetails: {}, pickup_details: {}, serviceCenterActivityDetails: { lastActivityType: null }, userDetails: {}, userAddress: {}, bankDetails: { key1: "Value 1", key2: "Value 2", key3: "Value 3" } };
                newOrderListResponse.push(complainDetails);
                complain.complainDetails.forEach((complainDet) => {
                    complainDetails.complainDetail[complainDet.field.field_name] = complainDet['field_val'];
                })
                if (ArrayHelper.isArrayValid(complain.userPlan.pickupDeliveryDetail.serviceCenterOrder)) {
                    complainDetails.serviceCenterOrderDetails = complain.userPlan.pickupDeliveryDetail.serviceCenterOrder[0];
                }
                if (ArrayHelper.isArrayValid(complain.userPlan.userPayments)) {
                    complainDetails.orderDetails = complain.userPlan.userPayments[0];
                }
                complainDetails.pickup_details['id'] = complain.userPlan.pickupDeliveryDetail.id;
                complainDetails.serviceCenterActivityDetails.lastActivityType = complain.userPlan.pickupDeliveryDetail.serviceCenterActivity[0].activity_type;
                complainDetails.serviceCenterActivityDetails['status'] = "Order Status";
                complainDetails.userDetails = complain.user;
                complainDetails.userAddress = complain.userPlan.pickupDeliveryDetail.userAddress;
            })
        }
        return newOrderListResponse;
    }

    public processServiceCenterOrderDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.addServiceCenterOrderDetails, callableFunctionParams: params }).setMethod({ callableFunction: this.addUserToConfirmServiceCenterActivity, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.afterProcessingServiceCenterOrderDetails }).coordinate();
        return result;
    }

    public addServiceCenterOrderDetails = async (methodParamEntity: MethodParamEntity) => {
        let topParams = methodParamEntity.topMethodParam;
        let addServiceCenterOrderDetailsParams: ServiceCenterOrderAttributes = { pickup_delivery_id: topParams.pickup_delivery_id, imei_number: topParams.imei_number, device_front_image: topParams.device_front_image, device_back_image: topParams.device_back_image, phone_warranty: topParams.phone_warranty, service_to_be_done: topParams.service_to_be_done, invoice_total_amount: topParams.invoice_total_amount, proforma_invoice_image: topParams.proforma_invoice_image, due_date: topParams.due_date, device_delivery_date: topParams.device_delivery_date, not_warranty_reason: topParams.not_warranty_reason };
        let result = await serviceCenterOrderRepositoryIns.create(addServiceCenterOrderDetailsParams);
        return result
    }

    public addUserToConfirmServiceCenterActivity = async (methodParamEntity: MethodParamEntity) => {
        let addServiceCenterOrderDetails = methodParamEntity.topMethodParam;
        let result = await this.addServiceCenterActivity({ activityType: ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM, pickupDeliveryId: addServiceCenterOrderDetails.pickup_delivery_id });
        if (methodParamEntity.topMethodParam.phone_warranty === PhoneWarrantyTypeEnum.IN_WARRANTY) {
            await this.addServiceCenterActivity({ activityType: ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_MADE_PAYMENT, pickupDeliveryId: addServiceCenterOrderDetails.pickup_delivery_id });
        }
        return result;
    }

    public afterProcessingServiceCenterOrderDetails = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        topParams.activity_type = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM;
        afterSetActivityEventEmitterIns.emit(EventEmitterIdentifierEnum.AFTER_SET_ACTIVITY_EVENTEMITTER, topParams);
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
        return result;
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
        await pickupDeliveyRepositoryIns.markPickupDeliveryServiceDenied(pickupDeliveryId);
    }

    public afterSetActivity = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        if (topParams.activity_type === ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED) {
            await this.removeServiceCenter(topParams.pickup_delivery_id);
        }
        afterSetActivityEventEmitterIns.emit(EventEmitterIdentifierEnum.AFTER_SET_ACTIVITY_EVENTEMITTER, params.topMethodParam);
    }

    public assignAnotherServiceCenter = async () => {
    }

    public addDispatchDetail = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        topParams.activity_type = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH;
        // setMethod({ callableFunction: this.isLastDBActivityValid, callableFunctionParams: topParams })
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.createDispatchDetails, callableFunctionParams: topParams }).setMethod({ callableFunction: this.addReadyToDispatchActivity, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.afterAddDispatchDetails }).coordinate();
        return result;
    }

    public afterAddDispatchDetails = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        topParams.activity_type = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH;
        afterSetActivityEventEmitterIns.emit(EventEmitterIdentifierEnum.AFTER_SET_ACTIVITY_EVENTEMITTER, topParams);
    }

    public createDispatchDetails = async (params: MethodParamEntity) => {
        let topParams = params.topMethodParam;
        let result = await deviceDispatchDetailsRepositoryIns.create({ pick_delivery_id: topParams.pickup_delivery_id, device_back_image: topParams.device_back_image, device_front_image: topParams.device_front_image, final_invoice_image: topParams.final_invoice_image, final_invoice_amount: topParams.final_invoice_amount });
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
            trends_detais: {
                total_order: 0,
                total_order_percentage: 0,
                order_ongoing: 0,
                order_ongoing_percentage: 0,
                order_completed: 0,
                order_completed_percentage: 0
            },
            order_type_count_details: { all: 0, completed: 0, order_request: 0, in_process: 0, decline: 0 }
        }
        result.order_type_count_details.all = await serviceCenterRepositoryIns.getAllOrderCount(topParams.sc_id);
        result.order_type_count_details.completed = await serviceCenterRepositoryIns.getCompletedOrderCount(topParams.sc_id);
        result.order_type_count_details.order_request = await serviceCenterRepositoryIns.getOrderRequestOrderCount(topParams.sc_id);
        result.order_type_count_details.in_process = await serviceCenterRepositoryIns.getInProcessOrderCount(topParams.sc_id);
        result.order_type_count_details.decline = await serviceCenterRepositoryIns.getDeclinedOrderCount(topParams.sc_id);
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