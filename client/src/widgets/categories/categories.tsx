import React, {FC, memo} from "react";
import classes from './categories.module.scss'
import {Category} from "../../entities/category/category";
import {useGetCategoriesQuery} from "../../store/API/categoriesApi";
import {ICategory} from "../../types/types";
import {NavLink} from "react-router-dom";
import {Loader} from "../../shared/loader/loader";


interface IType {
    children?: React.ReactNode
    inkAll?: boolean
}

export const Categories: FC<IType> = memo(({children}) => {
    const {data, isError, isLoading} = useGetCategoriesQuery('')
    if (isError) {
        return <h2 className={'error'}>Произошла ошибка при загрузке данных. Попробуйте обновить страницу</h2>
    }
    return (
        <div>
            {isLoading && <Loader height={184}/>}
            {
                data && data.map((item: ICategory) =>
                    <NavLink key={item.id} to={`/category/${item.id}`}>
                        <Category data={item} inkAll/>
                    </NavLink>
                )
            }

        </div>
    )
}) 
