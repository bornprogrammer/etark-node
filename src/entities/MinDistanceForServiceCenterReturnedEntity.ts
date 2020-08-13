import { in } from "sequelize/types/lib/operators";
import { FloatDataType } from "sequelize/types";



export interface MinDistanceForServiceCenterReturnedEntity {
    distance: number; // meters
    distanceKM: number;
    minDestIndex: number;
}