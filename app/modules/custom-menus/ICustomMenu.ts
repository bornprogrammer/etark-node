export interface ICustomMenu {
    readonly id?: number;
    buddyId: number;
    name: string;
    description: string;
    isDeleted?: boolean;

}

export default ICustomMenu;
