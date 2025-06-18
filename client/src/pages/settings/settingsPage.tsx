import {MainLayout} from "../../layout/mainLayout"
import {Button} from "../../shared/button/button";
import {useGetCategoriesQuery} from "../../store/API/categoriesApi";
import {ICategory} from "../../types/types";
import {Category} from "../../entities/category/category";
import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {AddAndEditForm} from "../../widgets/addAndEditForm/addAndEditForm";
import {Loader} from "../../shared/loader/loader";


const SettingsPage = () => {
    const {data, isError, isLoading} = useGetCategoriesQuery('')
    const [addCategory, setAddCategory] = useState(false)

    const addHandler = () => {
        setAddCategory(true)
    }

    return (
        <MainLayout heading={'Настройка'} textCenter>
            {
                addCategory ?
                    <AddAndEditForm addCategoryForm/>
                    :
                    <>
                        <div className={'mb-6'}>
                            <Button onClick={addHandler}>добавить категорию +</Button>
                        </div>
                        {isLoading && <Loader height={164}/>}
                        {
                            data && data.map((item: ICategory) =>
                                <NavLink key={item.id} to={`/more/settings-category/${item.id}`}>
                                    <Category data={item}/>
                                </NavLink>
                            )
                        }
                    </>
            }
        </MainLayout>
    );
};
export default SettingsPage;
