export interface IUser {
    readonly id: number;
    name: string;
    phone: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IUser;
