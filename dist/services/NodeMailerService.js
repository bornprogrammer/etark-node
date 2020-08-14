"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMailerServiceIns = exports.NodeMailerService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class NodeMailerService {
    /**
     *
     */
    constructor() {
        this.sendHtml = (from, to, subject, htmlTemplate) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("recipient", to);
                let response = yield this.transporter.sendMail({
                    from: from,
                    to: to,
                    subject: subject,
                    html: htmlTemplate,
                });
                console.log("email sent", response);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.transporter = nodemailer_1.default.createTransport({
            // host: "smtp.gmail.com",
            host: "smtp.zoho.in",
            port: 465,
            // port: 587,
            secure: true,
            auth: {
                // user: "iamabornprogrammer@gmail.com", // generated ethereal user
                // pass: "Divyani_1990", // generated ethereal password
                user: "service@etark.in",
                pass: "etarklegal2020"
            },
        });
    }
}
exports.NodeMailerService = NodeMailerService;
exports.nodeMailerServiceIns = new NodeMailerService();
//# sourceMappingURL=NodeMailerService.js.map