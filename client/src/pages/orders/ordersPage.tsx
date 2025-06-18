
import {MainLayout} from "../../layout/mainLayout"
import {Orders} from "../../widgets/orders/orders";


const OrdersPage = () => {

    return (
        <MainLayout heading={'Заказы'} textCenter>
            <Orders/>
        </MainLayout>
    );
};
export default OrdersPage;
