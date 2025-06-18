import {MainLayout} from "../../layout/mainLayout";
import {Categories} from "../../widgets/categories/categories";


const HomePage = () => {
    return (
        <MainLayout heading={'Что вы предпочитайте?'} homePage isSearch>
            <Categories inkAll/>
        </MainLayout>
    );
};
export default HomePage;
