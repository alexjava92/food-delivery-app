import {MainLayout} from "../../layout/mainLayout";
import {useGetCategoryQuery} from "../../store/API/categoriesApi";
import {Products} from "../../widgets/products/products";
import {useParams} from "react-router-dom";
import {Loader} from "../../shared/loader/loader";
import React from "react";


const CategoryPage = () => {
    const {id} = useParams()
    const {data, isError, isLoading} = useGetCategoryQuery(`${id}`)

    return (
        <MainLayout heading={data?.title} isSearch>
            <div>
                {isLoading && <Loader height={125}/>}
                {data && <Products data={data?.products}/>}
            </div>
        </MainLayout>
    );
};
export default CategoryPage;
