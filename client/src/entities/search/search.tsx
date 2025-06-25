import React, {FC, memo, useEffect, useState} from "react";
import classes from './search.module.scss'
import {SearchIcon} from "../../shared/images/icons/searchIcon";
import {useSearchQuery} from "../../store/API/searchApi";
import {NavLink} from "react-router-dom";
import {IProduct} from "../../types/types";


interface IType {
    url: string
    callback?: (arr: any) => void
}

export const Search: FC<IType> = memo(({url, callback}) => {
    const [query, setQuery] = useState('')
    const [skip, setSkip] = useState(true)
    const [products, setProducts] = useState<IProduct[]>()
    const {data, error, isLoading} = useSearchQuery(`${url}=${query}`, {skip})

    useEffect(() => {
        if (query.length > 1) {
            setSkip(false)
            if (callback) {
                callback(data)
            } else {
                setProducts(data)
            }
        }
    }, [data, query]);
    return (
        <div className={classes.search}>
            <label className={classes.label}>
                <input
                    className={classes.input} type="search"
                    placeholder={'Поиск'}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}/>
                {
                    !query &&
                    <span className={classes.icon}>
                        <SearchIcon/>
                    </span>
                }
            </label>
            {
                (query.length > 1 && !callback) &&
                <div className={classes.box}>
                    {
                        (products?.length) ?
                            products?.map(item =>
                                <NavLink key={item.id} className={classes.inner} to={`/product/${item.id}`}>
                                    <div className={classes.image}>
                                        <img src={process.env.REACT_APP_API_URL + item.image} alt={item.title}/>
                                    </div>
                                    <div>
                                        <div className={classes.title}>{item.title}</div>
                                        <div className={classes.description}>{item.description}</div>
                                        <div className={classes.price}>{item.price}₽</div>
                                    </div>
                                </NavLink>
                            )
                            :
                            <div className={classes.title}>Ничего не найдено</div>
                    }
                </div>
            }
        </div>
    )
}) 
