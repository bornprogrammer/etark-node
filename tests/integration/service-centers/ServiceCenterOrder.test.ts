

import request from 'supertest';
import { appInstance } from '@app/app';
import { HttpResponseCode } from '@app/enums/HttpResponseCodes';
import { PhoneWarrantyTypeEnum } from '@app/enums/PhoneWarrantyTypeEnum';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe("service center order details post api", () => {

    let appIns;
    
    beforeEach(() => { appIns = appInstance.server });

    afterEach(async () => { await appIns.close() });

    let orderDetailsBody = () => {
        return {
            "pickup_delivery_id": "11",
            "imei_number": "ssssss",
            "device_front_image": "font_image",
            "device_back_image": "back_image",
            "phone_warranty": PhoneWarrantyTypeEnum.IN_WARRANTY,
            "service_to_be_done": "ss",
            "invoice_total_amount": "10.50",
            "proforma_invoice_image": "ss",
            "final_invoice_image": "ss",
            "due_date": "ss",
            "device_delivery_date": "ss"
        }
    }

    describe("validation test", () => {

        it("validate pickup_delivery_id", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.pickup_delivery_id = "";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.status).toBe(400);
            expect(result.body.message).toContain("pickup_delivery_id");
        })
        it("validate pickup_delivery_id must be greater than zero", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.pickup_delivery_id = "0";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.status).toBe(400);
            expect(result.body.message).toContain("pickup_delivery_id");
        })
        it("validate imei_number", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.imei_number = "";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("imei_number");
        })
        it("validate device_front_image", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.device_front_image = "";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("device_front_image");
        })
        it("validate device_back_image", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.device_back_image = "";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("device_back_image");
        })
        it("validate phone_warranty", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.phone_warranty = null;
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("phone_warranty");
        })
        it("validate service_to_be_done", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.service_to_be_done = "";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("service_to_be_done");
        })
        it("validate invoice_total_amount", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.invoice_total_amount = "";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("invoice_total_amount");
        })
        it("validate invoice_total_amount must be > 0", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.invoice_total_amount = "0";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("invoice_total_amount");
        })
        it("validate proforma_invoice_image", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.proforma_invoice_image = "";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("proforma_invoice_image");
        })
        it("validate final_invoice_image", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.final_invoice_image = "";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("final_invoice_image");
        })
        it("validate due_date", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.due_date = "";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("due_date");
        })

        it("validate device_delivery_date", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            orderDetailsBodyObj.device_delivery_date = "";
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.body.message).toContain("device_delivery_date");
        })

        it("should insert the data", async () => {
            let orderDetailsBodyObj = orderDetailsBody();
            let result = await request(appIns).post("/api/sc/1").send(orderDetailsBodyObj);
            expect(result.status).toBe(HttpResponseCode.RESOURCES_CREATED);
        })
    })
}) 

