import { serviceCenterServiceIns } from "../../../../src/features/service-center/ServiceCenterService"
import { ServiceCenterOrderTypeEnum } from "@app/enums/ServiceCenterOrderTypeEnum";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";

describe("return activity type", () => {

    it("should return allocated type", async () => {
        let result = await serviceCenterServiceIns.getServiceCenterActivityTypeByOrderType("allocated");
        expect(result).toEqual(['allocated']);
    })

    it("should return accepted orders", async () => {

        let result = await serviceCenterServiceIns.getServiceCenterActivityTypeByOrderType("order_accepted");

        expect(result).toEqual(['order_accepted']);
    })

    it("should return the completed order", async () => {

        let result = await serviceCenterServiceIns.getServiceCenterActivityTypeByOrderType(ServiceCenterOrderTypeEnum.ORDER_TYPE_COMPLETED);

        expect(result).toEqual([ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_DISPATCHED]);
    })

    it("should return the allocated type as last updated activity", async () => {
        let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED);
        expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED_AFTER_INSPECTION);
    })

    it("should return the allocated type as last updated activity", async () => {
        let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED);
        expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED);
    })

    it("should return the order_accepted type as last updated activity", async () => {
        let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED_AFTER_INSPECTION);
        expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED);
    })

    it("should return the user_declined_payment type as last updated activity", async () => {
        let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT);
        expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM);
    })

    it("should return the allocated type as last updated activity", async () => {
        let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED);
        expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED);
    })

    it("should return the allocated type as last updated activity", async () => {
        let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED);
        expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED);
    })


})

describe("add/update service center order details ", () => {
}); 