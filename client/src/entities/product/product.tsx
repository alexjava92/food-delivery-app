import React, { FC, memo, useEffect, useState } from "react";
import classes from "./product.module.scss";
import { IProduct } from "../../types/types";
import { FavoritesIcon } from "../../shared/images/icons/favoritesIcon";
import { PlusAndMinus } from "../../shared/plusAndMinus/plusAndMinus";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

interface IType {
    data: IProduct;
    inCart?: boolean;
    inOrder?: boolean;
    editAdmin?: boolean;
    oneProduct?: boolean;
    count?: number;
}

export const Product: FC<IType> = memo(({ data, inOrder, inCart, count, editAdmin, oneProduct }) => {
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

    const [{ scale, x, y }, api] = useSpring(() => ({ scale: 1, x: 0, y: 0 }));

    const bind = useGesture(
        {
            onPinch: ({ da: [d], origin, event, memo }) => {
                event.preventDefault();

                const target = event.target as HTMLElement;
                if (!memo) {
                    const rect = target.getBoundingClientRect();
                    const offsetX = origin[0] - (rect.left + rect.width / 2);
                    const offsetY = origin[1] - (rect.top + rect.height / 2);
                    memo = { offsetX, offsetY };
                }

                const nextScale = Math.max(1, Math.min(3, d));
                api.start({ scale: nextScale });
                return memo;
            },
            onDrag: ({ offset: [dx, dy], pinching }) => {
                if (!pinching && scale.get() > 1) {
                    api.start({ x: dx, y: dy });
                }
            },
            onDoubleClick: () => {
                const next = scale.get() > 1 ? 1 : 2;
                api.start({ scale: next, x: 0, y: 0 });
            },
        },
        {
            drag: {
                from: () => [x.get(), y.get()],
                filterTaps: true,
                bounds: scale.get() > 1 ? undefined : { left: 0, right: 0, top: 0, bottom: 0 },
                rubberband: true,
            },
            pinch: { scaleBounds: { min: 1, max: 3 }, rubberband: true },
            target: undefined,
            eventOptions: { passive: false },
        }
    );




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

            <animated.div className={classes.image} {...bind()} style={{ touchAction: "none", overflow: "hidden" }}>
                <animated.img
                    src={process.env.REACT_APP_API_URL + data?.image}
                    alt={data?.title}
                    className={classes.zoomImage}
                    style={{ scale, x, y }}
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

                <div className={classes.description}>{data?.description}</div>

                {!inCart && !inOrder && <div className={classes.price}>{data?.price} ₽</div>}
            </div>

            {inCart && (
                <div className={classes.priceBox}>
                    <PlusAndMinus data={data} />
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
                    {inOrder && <span className={classes.count}>x{data?.count}</span>}
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
        </div>
    );
});
