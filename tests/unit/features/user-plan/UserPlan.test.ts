import { serviceCenterServiceIns } from "../../../../src/features/service-center/ServiceCenterService"
describe("return activity type", () => {

    it("should return allocated type", async () => {
        let result = await serviceCenterServiceIns.getServiceCenterActivityTypeByOrderType("allocated");
        expect(result).toEqual(['allocated']);
    })
})