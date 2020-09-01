import BaseRepository from "./BaseRepository";
import { Complaint } from "@app/models/Complaint";
import { GetServiceCenterOrderListParamsEntity } from "@app/repo-method-param-entities/GetServiceCenterOrderListParamsEntity";
import { ServiceCenterActivity } from "@app/models/ServiceCenterActivity";
import { GetServiceCenterAllActivitiesDetailsParamsEntity } from "@app/repo-method-param-entities/GetServiceCenterAllActivitiesDetailsParamsEntity";
import { ServiceCenterLoginParamsEntity } from "@app/repo-method-param-entities/ServiceCenterLoginParamsEntity";
import { ServiceCenters } from "@app/models/ServiceCenters";
import { DoesSCExistsByCityIdNMakerIdEntityParams } from "@app/repo-method-param-entities/DoesSCExistsByCityIdNMakerIdEntityParams";
import { ServiceCenterDetail } from "@app/models/ServiceCenterDetail";

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
        let result = await Complaint.scope(['complainDetails', 'getSuccessUserPlan', { method: ['getDeliveryDetails', params.serviceCenterId, params.activityTypes] }]).findAll({
            limit: params.pagination.limit,
            offset: params.pagination.offset,
            order: [[
                'id', 'desc'
            ]]
        });
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
                        maker_id: params.makerId
                    }
                },
            ],
            where: {
                city_id: params.cityId
            }
        })
        return result;
    }
}

export const serviceCenterRepositoryIns = new ServiceCenterRepository();