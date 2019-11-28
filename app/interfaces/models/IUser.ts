export interface IUser {
    readonly id: number;
    name: string;
<<<<<<< HEAD
    phone: number;
=======
    emailId: string;
    phone: string;
>>>>>>> 20512585d6ea07d17adba1ad5802358b653cd57c
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IUser;
