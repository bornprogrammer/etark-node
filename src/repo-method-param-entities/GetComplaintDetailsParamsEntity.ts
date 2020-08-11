
export class GetComplaintDetailsParamsEntity {
    complaintId: number;
    complaintStatus: string[] = ['pending', 'resolved'];
    constructor(complaintId: number) {
        this.complaintId = complaintId;
    }
}