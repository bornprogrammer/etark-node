
import nodemailer from 'nodemailer';

export class NodeMailerService {

    private transporter: any
    /**
     *
     */
    constructor() {
        this.transporter = nodemailer.createTransport({
            // host: "smtp.gmail.com",
            host: "smtp.zoho.in",
            port: 465,
            // port: 587,
            secure: true, // true for 465, false for other ports
            auth: {
                // user: "iamabornprogrammer@gmail.com", // generated ethereal user
                // pass: "Divyani_1990", // generated ethereal password
                user: "service@etark.in",
                pass: "etarklegal2020"
            },
        })
    }

    public sendHtml = async (from: string, to: string, subject: string, htmlTemplate: string) => {
        try {
            await this.transporter.sendMail({
                from: from, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                html: htmlTemplate, // html body
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export const nodeMailerServiceIns = new NodeMailerService();