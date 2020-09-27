
import config from 'config';
import nodemailer from 'nodemailer';
export class NodeMailerService {

    private transporter: any
    /**
     *
     */
    constructor() {
        this.transporter = nodemailer.createTransport({
            // host: "smtp.gmail.com",
            host: config.get("mail.host"),
            port: config.get("mail.port"),
            // port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: config.get("mail.user"),
                pass: config.get("mail.pass")
                // user: "services@etark.in",
                // pass: "Etark2020"
            },
        })
    }

    public sendHtml = async (from: string, to: string, subject: string, htmlTemplate: string) => {
        try {
            from = config.get("mail.from");
            let response = await this.transporter.sendMail({
                from: from, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                html: htmlTemplate, // html body
            });
            console.log("maill response", response);
        } catch (error) {
            console.log(error);
        }
    }
}

export const nodeMailerServiceIns = new NodeMailerService();