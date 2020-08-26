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
})

describe("add/update service center order details ", () => {
}); 