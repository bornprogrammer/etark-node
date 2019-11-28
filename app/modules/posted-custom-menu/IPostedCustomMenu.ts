export interface ICustomMenu {
    readonly id: number;
    custom_menu_id: number;
    advance_notice_time: number;
    minimum_cart_value: number;
    serving_limits: number;
    advance_payment: number;
    discount_threshold: number;
    post_type: number;
    is_deleted: boolean;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default ICustomMenu;
