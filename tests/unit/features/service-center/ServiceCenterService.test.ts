import { serviceCenterServiceIns } from "../../../../src/features/service-center/ServiceCenterService"
import { ServiceCenterOrderTypeEnum } from "@app/enums/ServiceCenterOrderTypeEnum";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";
import { ServiceCenterActivity } from "@app/models/ServiceCenterActivity";

describe("service center service", () => {

    describe("activity type by order type", () => {

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

    describe("service center last activity type by current activity", () => {

        it("should return the allocated type for accepted orders", async () => {
            let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED);
            expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED);
        })

        it("should return the allocated type for orders decline", async () => {
            let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED);
            expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED);
        })

        it("should return the order accepted type for service denied after inspection", async () => {
            let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED_AFTER_INSPECTION);
            expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED);
        })

        it("should return the user to confirm activity type when user decline payment", async () => {
            let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT);
            expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM);
        })

        it("should return the user denied payment,service deined after inspection activity type when sc claimed inspecion fee", async () => {
            let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_INSPECTION_FEE_CLAIMED);
            expect(result.sort()).toEqual([ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED_AFTER_INSPECTION].sort());
            expect(result).toContain(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED_AFTER_INSPECTION);
            expect(result).toBeInstanceOf(Array);
        })

        it("should return the user made payment when ready to dispatch devices", async () => {
            let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH);
            expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_MADE_PAYMENT);
        })

        it("should return the ready to dispatch activity type when dispatched devices", async () => {
            let result = await serviceCenterServiceIns.getServiceCenterLastActivityType(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_DISPATCHED);
            expect(result).toBe(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH);
        })
    })

    describe("compare service center db activities with given activity", () => {

        let allocatedActivity = new ServiceCenterActivity();
        allocatedActivity.activity_type = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED;

        let orderAcceptedActivity = new ServiceCenterActivity();
        orderAcceptedActivity.activity_type = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED;

        let userToConfirm = new ServiceCenterActivity();
        userToConfirm.activity_type = ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM;

        let serviceCenterActivties: ServiceCenterActivity[] = [allocatedActivity, orderAcceptedActivity, userToConfirm];

        it("should return true", async () => {
            let result = await serviceCenterServiceIns.isLastDBActivityValid(serviceCenterActivties, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM);
            expect(result).toBeTruthy();
        })

        it("should return false", async () => {
            let result = await serviceCenterServiceIns.isLastDBActivityValid(serviceCenterActivties, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED);
            expect(result).toBeFalsy();
        })
    })
})

