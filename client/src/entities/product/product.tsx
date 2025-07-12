import React, {FC, memo, useEffect, useState} from "react";
import classes from "./product.module.scss";
import {IProduct} from "../../types/types";
import {FavoritesIcon} from "../../shared/images/icons/favoritesIcon";
import {PlusAndMinus} from "../../shared/plusAndMinus/plusAndMinus";
import {useSpring, animated} from "@react-spring/web";
import {useGesture} from "@use-gesture/react";

interface IType {
    data: IProduct;
    inCart?: boolean;
    inOrder?: boolean;
    editAdmin?: boolean;
    oneProduct?: boolean;
    count?: number;
}

export const Product: FC<IType> = memo(({data, inOrder, inCart, count, editAdmin, oneProduct}) => {
    const [favouritesProduct, setFavouritesProduct] = useState<IProduct[]>();

    const classesArr = [classes.product];
    if (oneProduct) classesArr.push(classes.oneProduct);
    if (inCart || inOrder) classesArr.push(classes.small);

    useEffect(() => {
        const local = localStorage.getItem("food-delivery-favorites");
        const favorites = JSON.parse(local ? local : "[]");
        if (favorites) setFavouritesProduct(favorites);
    }, []);

    const toggleFavorite = (e: any) => {
        e.preventDefault();
        const favorites = JSON.parse(localStorage.getItem("food-delivery-favorites") || "[]");
        const isFavorite = favorites.find((product: IProduct) => product.id === data.id);
        if (isFavorite) {
            const updatedFavorites = favorites.filter((item: any) => item.id !== data.id);
            localStorage.setItem("food-delivery-favorites", JSON.stringify(updatedFavorites));
            setFavouritesProduct(updatedFavorites);
        } else {
            const updatedFavorites = [...favorites, data];
            localStorage.setItem("food-delivery-favorites", JSON.stringify(updatedFavorites));
            setFavouritesProduct(updatedFavorites);
        }
    };

    const [{scale}, api] = useSpring(() => ({scale: 1}));
    const bind = useGesture(
        {
            onPinch: ({offset: [s]}) => api.start({scale: s}),
            onWheel: ({offset: [, s]}) => api.start({scale: 1 + s / 100}),
            onDoubleClick: () => api.start({scale: 1}),
        },
        {
            pinch: {scaleBounds: {min: 1, max: 3}, rubberband: true},
        }
    );



    const countProduct = inOrder
        ? (data && ((data as any)?.OrderProductsModel?.count ||
        (data as any)?.order_product?.count ||
        data.count)) || 1
        : data?.count || 1;



    return (
        <div className={classesArr.join(" ")}>
            {!data?.disabled && (
                <>
                    <div className={classes.disabled}></div>
                    <span className={`error ${classes.textError}`}>
                        К сожалению данный товар временно отсутствует
                    </span>
                </>
            )}

            <animated.div className={classes.image} {...bind()} style={{touchAction: "none"}}>
                <animated.img
                    src={process.env.REACT_APP_API_URL + data?.image}
                    alt={data?.title}
                    style={{scale}}
                    className={classes.zoomImage} // можно стилизовать под нужные размеры
                />
            </animated.div>

            <div className={classes.box}>
                <div className={classes.title}>
                    <span>
                        <span>{data?.title} </span>
                        <span className={classes.grams}>{data?.grams}</span>
                    </span>

                    {!editAdmin && !inCart && !inOrder && (
                        <span onClick={toggleFavorite}>
                            <FavoritesIcon
                                isActive={!!favouritesProduct?.find((product: IProduct) => product?.id === data?.id)}
                            />
                        </span>
                    )}
                </div>
                {oneProduct && data?.description && (
                    <div className={classes.description}>{data.description}</div>
                )}

                {!inCart && !inOrder && <div className={classes.price}>{data?.price} ₽</div>}
            </div>

            {inCart && (
                <div className={classes.priceBox}>
                    <PlusAndMinus data={data}/>
                    <div className={classes.price}>
                        {data.count && data.count > 1 ? (
                            <>
                                <span className={classes.subPrice}>
                                    {data.count} x {data.price}
                                </span>{" "}
                                {data.count * +data.price} ₽
                            </>
                        ) : (
                            `${data.price} ₽`
                        )}
                    </div>
                </div>
            )}

            {inOrder && (
                <div className={classes.priceBox}>
                    <span className={classes.count}>x{countProduct}</span>
                    <div className={classes.price}>
                        {countProduct > 1 ? (
                            <>
          <span className={classes.subPrice}>
            {countProduct} x {data.price}
          </span>{" "}
                                {countProduct * +data.price} ₽
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
