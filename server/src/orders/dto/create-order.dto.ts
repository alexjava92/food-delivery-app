export class CreateOrderDto {
    readonly typeDelivery: string;
    readonly address: string;
    readonly phone: string;
    readonly name: string;
    readonly paymentMethod: string;
    readonly userId: number;
    readonly status: string;
    readonly notifications: boolean;
    readonly orderProducts: {id:number,count:number}[]
}
