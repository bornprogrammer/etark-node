import { BasePostRestAPIIntegration } from "../bases/BasePostRestAPIIntegration";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";

export class AddComplaintStrength extends BasePostRestAPIIntegration {

    /**
     *
     */
    constructor() {
        super();
        this.url = "complaints/508/strengths";
        this.testSuiteName = "add complaint strength";
    }

    protected getPostData() {
        return {
            "problem_after_cleanup": "yes",
            "problem_occured_within_year": "yes",
            "phone_damaged_by_anyone_else": "no",
            "liquid_damaged_report_generated": "yes",
            "problem_occured_within_6month": "no",
            "complaint_againts_some_accessory": "yes"
        }
    }

    public describe = () => {

        describe("validate complain strength params", () => {

            it("should validate empty problem_after_cleanup", this.validateEmptyProblemAfterCleanup);

            it("should validate wrong problem_after_cleanup", this.validateInvalidProblemAfterCleanup);

            it("should validate empty problem_occured_within_year", this.validateEmptyProblemOccuredWithinYear);

            it("should validate wrong problem_occured_within_year", this.validateInvalidProblemOccuredWithinYear);

            it("should validate empty phone_damaged_by_anyone_else", this.validateEmptyPhoneDamagedByAnyoneElse);

            it("should validate wrong phone_damaged_by_anyone_else", this.validateInvalidPhoneDamagedByAnyoneElse);

            it("should validate empty liquid_damaged_report_generated", this.validateEmptyLiquidDamagedReportGenerated);

            it("should validate wrong liquid_damaged_report_generated", this.validateInvalidLiquidDamagedReportGenerated);

            it("should validate empty problem_occured_within_6month", this.validateEmptyProblemOccuredWithin6Month);

            it("should validate wrong problem_occured_within_6month", this.validateInvalidProblemOccuredWithin6Month);

            it("should validate empty complaint_againts_some_accessory", this.validateEmptyComplaintAgainstSomeAccessory);

            it("should validate wrong complaint_againts_some_accessory", this.validateInvalidComplaintAgainstSomeAccessory);

        })

        describe("insert complain strength", () => {
            it("compain strength ", this.validateInsertComplainStrength);
        })

    }

    private validateEmptyProblemAfterCleanup = async () => {
        this.setPostFieldEmpty("problem_after_cleanup");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateInvalidProblemAfterCleanup = async () => {
        this.setPostFieldWrongVal("problem_after_cleanup", "wrong");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateEmptyProblemOccuredWithinYear = async () => {
        this.setPostFieldEmpty("problem_occured_within_year");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateInvalidProblemOccuredWithinYear = async () => {
        this.setPostFieldWrongVal("problem_occured_within_year", "wrong");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateEmptyPhoneDamagedByAnyoneElse = async () => {
        this.setPostFieldEmpty("phone_damaged_by_anyone_else");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateInvalidPhoneDamagedByAnyoneElse = async () => {
        this.setPostFieldWrongVal("phone_damaged_by_anyone_else", "wrong");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateEmptyLiquidDamagedReportGenerated = async () => {
        this.setPostFieldEmpty("liquid_damaged_report_generated");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateInvalidLiquidDamagedReportGenerated = async () => {
        this.setPostFieldWrongVal("liquid_damaged_report_generated", "wrong");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateEmptyProblemOccuredWithin6Month = async () => {
        this.setPostFieldEmpty("problem_occured_within_6month");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateInvalidProblemOccuredWithin6Month = async () => {
        this.setPostFieldWrongVal("problem_occured_within_6month", "wrong");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateEmptyComplaintAgainstSomeAccessory = async () => {
        this.setPostFieldEmpty("complaint_againts_some_accessory");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateInvalidComplaintAgainstSomeAccessory = async () => {
        this.setPostFieldWrongVal("complaint_againts_some_accessory", "wrong");
        await this.callNCompareStatus(HttpResponseCode.BAD_REQUEST);
    }

    private validateInsertComplainStrength = async () => {
        this.resetPostFieldToOriginal();
        await this.callNCompareStatus(HttpResponseCode.RESOURCES_CREATED);
    }
}


export const addComplaintStrengthIns = () => {
    return new AddComplaintStrength();
}

addComplaintStrengthIns().runTest();