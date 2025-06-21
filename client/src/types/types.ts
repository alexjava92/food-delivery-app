export interface IProduct {
    id: number;
    title: string;
    price: string;
    image: string;
    userName: string;
    favourites?: boolean;
    categoryId: number;
    description?: string;
    count: number;
    grams: number;
    disabled: boolean;
}

export interface ICategory {
    id: number;
    title: string;
    image: string;
    products: IProduct[];
}

export interface IOrderCreate {
    id?: number | string;
    userId?: number;
    address?: string;
    typeDelivery?: string;
    phone?: string;
    name?: string;
    paymentMethod?: string;
    status?: string;
    sum?: number;
    comment?: string;
    orderProducts: { id: number; count: number }[];
}

export interface IOrder {
    id: number | string;
    userId?: number;
    address?: string;
    typeDelivery?: string;
    phone?: string;
    name?: string;
    paymentMethod?: string;
    sum?: number;
    orderProducts: IProduct[];
    notifications?: boolean;
    status?: string;
    user: {
        id: number;
        chatId: number | string;
    };
    comment?: string
}

export interface IUser {
    id?: number;
    chatId?: number;
    role?: string;
    username?: string;
    name?: string;
    email?: string;
    gender?: string;
    date?: string;
    phone?: string;
    address?: string;
}
