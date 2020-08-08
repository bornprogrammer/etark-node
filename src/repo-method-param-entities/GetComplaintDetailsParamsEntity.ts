
export class GetComplaintDetailsParamsEntity {
    complaintId: number;
    complaintStatus: string[] = ['pending'];

    constructor(complaintId: number) {
        this.complaintId = complaintId;
    }
}