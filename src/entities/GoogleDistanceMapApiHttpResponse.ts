
export interface GoogleDistanceMapApiHttpResponse {
    destination_addresses: string[];
    origin_addresses: string[];
    rows: { elements: GoogleDistanceMapApiRowelement[] }[];
}

export interface GoogleDistanceMapApiRowelement {
    distance: { text: string, value: number };
    duration: { text: string, value: number };
    status: string
}