import { SmartphoneComplainFieldsEnum } from "./SmartphoneComplainFieldsEnum";

export enum SmartphoneComplainFieldIdEnum {
    PROBLEM_DESCRIPTION = getSmartphoneComplainFieldId(SmartphoneComplainFieldsEnum.PROBLEM_DESCRIPTION),
    WINNING_CHANCES_ML_RESPONSE = getSmartphoneComplainFieldId(SmartphoneComplainFieldsEnum.WINNING_CHANCES_ML_RESPONSE),
    COMPENSATION_ML_RESPONSE = getSmartphoneComplainFieldId(SmartphoneComplainFieldsEnum.COMPENSATION_ML_RESPONSE),
    PHONE_PRICE = getSmartphoneComplainFieldId(SmartphoneComplainFieldsEnum.PHONE_PRICE),
    IMEI_NUMBER = getSmartphoneComplainFieldId(SmartphoneComplainFieldsEnum.IMEI_NUMBER),
    MODEL_NAME = getSmartphoneComplainFieldId(SmartphoneComplainFieldsEnum.MODEL_NAME),
    DEVICE_FRONT_IMAGE = getSmartphoneComplainFieldId(SmartphoneComplainFieldsEnum.DEVICE_FRONT_IMAGE),
    DEVICE_BACK_IMAGE = getSmartphoneComplainFieldId(SmartphoneComplainFieldsEnum.DEVICE_BACK_IMAGE),
    COMPENSATION_TYPE = getSmartphoneComplainFieldId(SmartphoneComplainFieldsEnum.COMPENSATION_TYPE),
}

function getSmartphoneComplainFieldId(smartphoneComplainField: SmartphoneComplainFieldsEnum) {
    let smartphoneComplainFieldId = null;

    switch (smartphoneComplainField) {
        case SmartphoneComplainFieldsEnum.DEVICE_FRONT_IMAGE:
            smartphoneComplainFieldId = 15;
            break;
        case SmartphoneComplainFieldsEnum.DEVICE_BACK_IMAGE:
            smartphoneComplainFieldId = 16;
            break;
        case SmartphoneComplainFieldsEnum.WINNING_CHANCES_ML_RESPONSE:
            smartphoneComplainFieldId = 18;
            break;
        case SmartphoneComplainFieldsEnum.COMPENSATION_ML_RESPONSE:
            smartphoneComplainFieldId = 19;
            break;
        case SmartphoneComplainFieldsEnum.COMPENSATION_TYPE:
            smartphoneComplainFieldId = 17;
            break;
    }
    return smartphoneComplainFieldId;
}