
export interface MinDistanceForServiceCenterReturnedEntity {
    distance: number; // meters
    distanceKM: number;
    minDestIndex: number;
    price?: number;
    serviceCenterId?: number;
}