import { fileReaderServiceIns } from "./FileReaderService";
import htmlpdf from "html-pdf";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { AppConstants } from "@app/constants/AppConstants";
import config from "config";

export class HTMLToPDFConverter {
    private options = {
        // "height": "11.25in",
        // "width": "8.5in",
        // "header": {
        //     "height": "20mm"
        // },
        // "footer": {
        //     "height": "20mm",
        // },
        // "format": "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
        // "orientation": "portrait",
    }
    /**
     *
     */
    constructor() {

    }

    // public convertInvoiceReport() {
    //     let d = fileReaderServiceIns.readEmailTemplate('invoice.html', this.callback);
    // }

    public convertComplainAnalysisReport = async (htmlReplacementData: any, callback: CallableFunction) => {
        await fileReaderServiceIns.readEmailTemplate('compaint-report.html', (error, htmlString: string) => {
            if (htmlReplacementData) {
                htmlReplacementData.base_url = UtilsHelper.getBaseURL();
                htmlString = UtilsHelper.replaceAllStr(htmlReplacementData, htmlString);
            }
            let fileName = AppConstants.COMPLAINT_ANALYSIS_FILE_PREFIX_NAME + Date.now() + ".pdf";
            let filePath = config.get("file_path") + fileName;
            htmlpdf.create(htmlString, this.options).toFile(filePath, function (err, res) {
                if (err) return console.log(err);
                callback(fileName);
            });
        });
    }

    public convertInvoiceReport = async (htmlReplacementData: any, callback: CallableFunction) => {
        await fileReaderServiceIns.readEmailTemplate('invoice.html', (error, htmlString: string) => {
            if (htmlReplacementData) {
                htmlReplacementData.base_url = UtilsHelper.getBaseURL();
                htmlString = UtilsHelper.replaceAllStr(htmlReplacementData, htmlString);
            }
            let fileName = AppConstants.INVOICE_FILE_PREFIX_NAME + Date.now() + ".pdf";
            let filePath = config.get("file_path") + fileName;
            htmlpdf.create(htmlString, this.options).toFile(filePath, function (err, res) {
                if (err) return console.log(err);
                callback(fileName);
            });
        });
    }

    public callback = async (htmlReplacementData, error, htmlString: string) => {
        if (htmlReplacementData) {
            htmlReplacementData.base_url = UtilsHelper.getBaseURL();
            htmlString = UtilsHelper.replaceAllStr(htmlReplacementData, htmlString);
        }
        htmlpdf.create(htmlString, this.options).toFile('./src/public/files/businesscard.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
        });
    }
}


export const htmlToPDFConverterIns = new HTMLToPDFConverter();