import { fileReaderServiceIns } from "./FileReaderService";
import htmlpdf from "html-pdf";

export class HTMLToPDFConverter {

    /**
     *
     */
    constructor() {

    }

    public convertInvoiceReport() {
        let d = fileReaderServiceIns.readEmailTemplate('invoice.html', this.callback);
    }

    public callback = async (error, data: any) => {
        htmlpdf.create(data, { format: "A4" }).toFile('./businesscard.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
        });
    }
}


export const htmlToPDFConverterIns = new HTMLToPDFConverter();