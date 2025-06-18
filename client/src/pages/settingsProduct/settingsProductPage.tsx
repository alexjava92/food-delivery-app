import {MainLayout} from "../../layout/mainLayout"
import {useParams} from "react-router-dom";
import { useGetOneProductQuery} from "../../store/API/productsApi";
import {AddAndEditForm} from "../../widgets/addAndEditForm/addAndEditForm";


const SettingsProductPage = () => {
    const {id} = useParams()
const {data,isLoading}=useGetOneProductQuery(id)

    return (
        <MainLayout heading={'Настройка'}>
            {
             !isLoading && <AddAndEditForm updateProductForm productId={id} productData={data}/>
            }
        </MainLayout>
    );
};
export default SettingsProductPage;
