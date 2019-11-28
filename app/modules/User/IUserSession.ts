export interface IUserSession {
    readonly id: number;
    userId: string;
    token: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IUserSession;
