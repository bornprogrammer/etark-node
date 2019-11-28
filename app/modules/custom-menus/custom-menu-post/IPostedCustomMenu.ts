 export default interface IPostedCustomMenu {
     readonly id?: number;
     customMenuId: number;
     advanceNoticeTime: DateTimeFormat;
     minimumCartValue: number;
     advancedPayment: number;
     servingLimits: number;
     discountThreshold: number;
     postType: string;
     createdAt?: DateTimeFormat;
     updatedAt?: DateTimeFormat;

}
