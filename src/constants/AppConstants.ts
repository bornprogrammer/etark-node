
export class AppConstants {
    public static readonly NO_OF_RECORD_PER_PAGE = 30;
    public static readonly SESSION_USER_ID = 'session_user_id';
    public static readonly ENVIRONMENTS_PROD = "production";
    public static readonly DELIVERY_PRICE_MARGIN = 50;
    public static readonly CGST = 18;
    public static readonly PAYTM_GATEWAY_CHARGES = 2.41;
    // public static readonly ORDER_ID_PREFIX = "E-Tark";
    public static readonly ML_MODEL_BASE_URL = "http://3.7.68.33/";
    public static readonly SERVER_BASE_URL = "https://api.etark.in";
    // public static readonly PAYTM_CALLBACK_URL = AppConstants.SERVER_BASE_URL + ":" + process.env.PORT + "";
    public static readonly ML_MODEL_CHANCES_OF_WINNING_URL = AppConstants.ML_MODEL_BASE_URL + "home";
    public static readonly ML_MODEL_COMPENSATION_URL = AppConstants.ML_MODEL_BASE_URL + "compensation";
    // public static readonly PAYTM_URL = "https://securegw.paytm.in";
    // public static readonly PAYTM_STAGE_URL = "https://securegw-stage.paytm.in/";
    public static readonly COMPLAINT_ANALYSIS_FILE_PREFIX_NAME = "complaint_report_";
    public static readonly INVOICE_FILE_PREFIX_NAME = "invoice_";
    public static readonly MERCHANT_FIELD_OTHER_VALUE = "other";
    public static readonly COMPANY_NAME = "ETark Tech.Pvt Ltd.";
}