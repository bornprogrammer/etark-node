import BaseRepository from "./BaseRepository";
import { Complaint } from "@app/models/Complaint";
import { GetServiceCenterOrderListParamsEntity } from "@app/repo-method-param-entities/GetServiceCenterOrderListParamsEntity";
import { ServiceCenterActivity } from "@app/models/ServiceCenterActivity";
import { GetServiceCenterAllActivitiesDetailsParamsEntity } from "@app/repo-method-param-entities/GetServiceCenterAllActivitiesDetailsParamsEntity";
import { ServiceCenterLoginParamsEntity } from "@app/repo-method-param-entities/ServiceCenterLoginParamsEntity";
import { ServiceCenters } from "@app/models/ServiceCenters";
import { DoesSCExistsByCityIdNMakerIdEntityParams } from "@app/repo-method-param-entities/DoesSCExistsByCityIdNMakerIdEntityParams";
import { ServiceCenterDetail } from "@app/models/ServiceCenterDetail";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { QueryTypes } from "sequelize";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";
import ArrayHelper from "@app/helpers/ArrayHelper";
import { City } from "@app/models/City";

export class ServiceCenterRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public create(params: any) {

    }

    public getServiceCenterOrderList = async (params: GetServiceCenterOrderListParamsEntity) => {
        let where = { payment_status: 'completed' };
        if (params.orderNo) {
            where['order_no'] = params.orderNo;
        }
        let result = await Complaint.scope(['defaultScope', 'complainDetails', { method: ['getSuccessUserPlan', where] }, { method: ['getDeliveryDetails', params.serviceCenterId, params.activityTypes, params.activityIds] }]).findAll({
            attributes: [
                'id',
                'maker_detail_id'
            ],
            limit: params.pagination.limit,
            offset: params.pagination.offset,
            order: [[
                'id', 'desc'
            ]]
        });
        return result;
    }

    public getLastActivityIds = async (serviceCenterId: number) => {
        let query = `select activities.activity_id from pickup_deliveries inner join (select max(id) as activity_id,pickup_delivery_id from service_center_activities group by pickup_delivery_id) as activities on pickup_deliveries.id = activities.pickup_delivery_id where service_center_id =:service_center_id`;
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT, replacements: { service_center_id: serviceCenterId } });
        return result;
    }

    public getFirstActivityIds = async (serviceCenterId: number) => {
        let query = `select activities.activity_id from pickup_deliveries inner join (select min(id) as activity_id,pickup_delivery_id from service_center_activities group by pickup_delivery_id) as activities on pickup_deliveries.id = activities.pickup_delivery_id where service_center_id =:service_center_id`;
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT, replacements: { service_center_id: serviceCenterId } });
        return result;
    }

    public getAllOrderCount = async (scId: number) => {
        let query = `select count(activities.activity_id) as order_count from pickup_deliveries inner join (select min(id) as activity_id,pickup_delivery_id from service_center_activities group by pickup_delivery_id) as activities on pickup_deliveries.id = activities.pickup_delivery_id where service_center_id =:service_center_id`;
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT, replacements: { service_center_id: scId } });
        return result[0]['order_count'];
    }

    public getCompletedOrderCount = async (scId: number) => {
        let result = await this.getOrderCountByType(scId, [ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_DISPATCHED]);
        return result[0]['order_count'];
    }

    public getDeclinedOrderCount = async (scId: number) => {
        let result = await this.getOrderCountByType(scId, [ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_INSPECTION_FEE_CLAIMED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_INSPECTION_FEE_DENIED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED]);
        return result[0]['order_count'];
    }

    public getOrderRequestOrderCount = async (scId: number) => {
        let result = await this.getOrderCountByType(scId, [ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ALLOCATED]);
        return result[0]['order_count'];
    }

    public getInProcessOrderCount = async (scId: number) => {
        let result = await this.getOrderCountByType(scId, [ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_MADE_PAYMENT, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_FAILURE, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED]);
        return result[0]['order_count'];
    }

    public getOrderCountByType = async (scId: number, lastActivityType: ServiceCenterActivityTypeEnum[]) => {
        let activityTypes = ArrayHelper.convertArrayToMysqlInOpStr(lastActivityType);
        let query = `select count(activities.activity_id) as order_count from pickup_deliveries inner join (select max(id) as activity_id,pickup_delivery_id from service_center_activities group by pickup_delivery_id) as activities on pickup_deliveries.id = activities.pickup_delivery_id inner join service_center_activities on activities.activity_id=service_center_activities.id and service_center_activities.activity_type in ${activityTypes}
        where service_center_id =:service_center_id and status in ('success','service_denied')`;
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT, replacements: { service_center_id: scId } });
        return result;
    }

    public getServiceCenterAllActivitiesDetails = async (params: GetServiceCenterAllActivitiesDetailsParamsEntity) => {
        let result = await ServiceCenterActivity.findAll({
            attributes: [
                'activity_type'
            ],
            where: {
                pickup_delivery_id: params.pickupDeliveryId
            },
            order: [
                ['id', 'asc']
            ]
        })
        return result;
    }

    public login = async (params: ServiceCenterLoginParamsEntity) => {
        let result = await ServiceCenters.findOne({
            attributes: [
                'id',
                'email',
                'name'
            ],
            where: {
                email: params.email,
                password: params.password
            }
        })
        return result;
    }

    public doesSCExistsByCityIdNMakerId = async (params: DoesSCExistsByCityIdNMakerIdEntityParams): Promise<ServiceCenters> => {
        let result = await ServiceCenters.findOne({
            include: [
                {
                    model: ServiceCenterDetail,
                    required: true,
                    as: "serviceCenterDetails",
                    where: {
                        maker_id: params.makerId,
                        status: 'active'
                    }
                },
                {
                    model: City,
                    required: true,
                    where: {
                        status: "active"
                    }
                }
            ],
            where: {
                city_id: params.cityId,
                status: 'active'
            }
        })
        return result;
    }
}

export const serviceCenterRepositoryIns = new ServiceCenterRepository();