export default interface ICustomMenuDishes {
    readonly id?: number;
    customMenuId: number;
    dishId: number;
    isEnable?: boolean;
}
