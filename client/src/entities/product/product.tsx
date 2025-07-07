import React, {FC, memo, useEffect, useState} from "react";
import classes from "./product.module.scss";
import {IProduct} from "../../types/types";
import {FavoritesIcon} from "../../shared/images/icons/favoritesIcon";
import {PlusAndMinus} from "../../shared/plusAndMinus/plusAndMinus";
import {ImageZoomModal} from "../../shared/imageZoomModal/ImageZoomModal";

interface IType {
    data: IProduct;
    inCart?: boolean;
    inOrder?: boolean;
    editAdmin?: boolean;
    oneProduct?: boolean;
    count?: number;
}

export const Product: FC<IType> = memo(({data, inOrder, inCart, count, editAdmin, oneProduct}) => {

    const [openZoom, setOpenZoom] = useState(false);

    const classesArr = [classes.product]
    if (oneProduct) classesArr.push(classes.oneProduct)
    if (inCart || inOrder) classesArr.push(classes.small)

    const [favouritesProduct, setFavouritesProduct] = useState<IProduct[]>()

    useEffect(() => {
        const local = localStorage.getItem('food-delivery-favorites')
        const favorites = JSON.parse(local ? local : '[]');
        if (favorites) setFavouritesProduct(favorites)
    }, []);

    const toggleFavorite = (e: any) => {
        e.preventDefault()
        const favorites = JSON.parse(localStorage.getItem('food-delivery-favorites') || '[]');
        const isFavorite = favorites.find((product: IProduct) => product.id === data.id);
        if (isFavorite) {
            const updatedFavorites = favorites.filter((item: any) => item.id !== data.id);
            localStorage.setItem('food-delivery-favorites', JSON.stringify(updatedFavorites));
            setFavouritesProduct(updatedFavorites)
        } else {
            const updatedFavorites = [...favorites, data];
            localStorage.setItem('food-delivery-favorites', JSON.stringify(updatedFavorites));
            setFavouritesProduct(updatedFavorites)
        }
    };

    return (
        <div className={classesArr.join(' ')}>
            {
                !data?.disabled &&
                <>
                    <div className={classes.disabled}></div>
                    <span className={`error ${classes.textError}`}>
                        К сожалению данный товар временно отсутствует
                    </span>
                </>
            }

            <div className={classes.image}>
                <img src={process.env.REACT_APP_API_URL + data?.image} alt={data?.title}/>
            </div>
            {openZoom && (
                <ImageZoomModal
                    src={process.env.REACT_APP_API_URL + data?.image}
                    onClose={() => setOpenZoom(false)}
                />
            )}

            <div className={classes.box}>
                <div className={classes.title}>
                    <span>
                        <span>{data?.title} </span>
                        <span className={classes.grams}>{data?.grams}</span>
                    </span>

                    {
                        (!editAdmin && !inCart && !inOrder) &&
                        <span onClick={toggleFavorite}>
                            <FavoritesIcon
                                isActive={!!favouritesProduct?.find((product: IProduct) => product?.id === data?.id)}/>
                        </span>
                    }


                </div>

                <div className={classes.description}>{data?.description}</div>

                {!inCart && !inOrder && (
                    <div className={classes.price}>{data?.price} ₽</div>
                )}
            </div>

            {/* Цена для корзины */}
            {inCart && (
                <div className={classes.priceBox}>
                    <PlusAndMinus data={data}/>
                    <div className={classes.price}>
                        {data.count && data.count > 1 ? (
                            <>
                                <span className={classes.subPrice}>
                                    {data.count} x {data.price}
                                </span>{' '}
                                {data.count * +data.price} ₽
                            </>
                        ) : (
                            `${data.price} ₽`
                        )}
                    </div>
                </div>
            )}

            {/* Цена для заказа */}
            {inOrder && (
                <div className={classes.priceBox}>
                    {inOrder && <span className={classes.count}>x{data?.count}</span>}
                    <div className={classes.price}>
                        {data.count && data.count > 1 ? (
                            <>
                                <span className={classes.subPrice}>
                                    {data.count} x {data.price}
                                </span>{' '}
                                {data.count * +data.price} ₽
                            </>
                        ) : (
                            `${data.price} ₽`
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});
