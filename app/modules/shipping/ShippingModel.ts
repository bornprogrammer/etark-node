import { sequelize } from '@app/config/Sequelize';
import ErrorFactory from '@app/errors/ErrorFactory';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { Sequelize } from 'sequelize';
import { userSessionRepository } from '../User/UserSessionRepository';

export class ShippingModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public addShippingAddress = async (shippingAddressParams) => {
        try {
            // tslint:disable-next-line: max-line-length
            // const query = `INSERT into shipping_addresses(user_id,door_no,street,locality,landmark,pincode,city,state,order_id,created_at,updated_at) VALUES(${shippingAddressParams.user_id},'${shippingAddressParams.door_no}','${shippingAddressParams.street}','${shippingAddressParams.locality}','${shippingAddressParams.landmark}','${shippingAddressParams.pincode}','${shippingAddressParams.city}','${shippingAddressParams.state}',${shippingAddressParams.order_id},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;

            const query = `INSERT into shipping_addresses(user_id,door_no,street,locality,landmark,pincode,city,state,order_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query({ query, values: [shippingAddressParams.user_id, shippingAddressParams.door_no, shippingAddressParams.street, shippingAddressParams.locality, shippingAddressParams.landmark, shippingAddressParams.pincode, shippingAddressParams.city, shippingAddressParams.state, shippingAddressParams.order_id] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }
    public addEAddress = async (eAddressParams) => {
        try {
            const query = `INSERT into e_address(order_id,name,email_id,phone,created_at,updated_at) VALUES(?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query({ query, values: [eAddressParams.order_id, eAddressParams.name, eAddressParams.email_id, eAddressParams.phone] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }
}

export const shippingModelIns = new ShippingModel();
