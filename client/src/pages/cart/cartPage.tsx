import {MainLayout} from "../../layout/mainLayout"
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import {Product} from "../../entities/product/product";
import React, {useEffect, useRef, useState} from "react";
import classes from "./cartPage.module.scss"
import {Button} from "../../shared/button/button";
import {FormCheckout} from "../../entities/formCheckout/formCheckout";
import {useGetContactsQuery} from "../../store/API/contactsApi";
import {createPortal} from "react-dom";
import {Modal} from "../../entities/modal/modal";
import {IProduct} from "../../types/types";
import {deleteSwipeProduct} from "../../store/slice/productsSlice";


const CartPage = () => {
    const dispatch = useAppDispatch();
    const {data: contactsData} = useGetContactsQuery('')
    const {productsInCart} = useAppSelector(state => state.productReducer)
    const [checkout, setCheckout] = useState(false)
    const [worktime, setWorktime] = useState(true)
    const [modal, setModal] = useState(false)
    const [swipeItem, setSwipeItem] = useState<IProduct | null>(null);
    const productRef = useRef<any>([])
    useEffect(() => {
     if(contactsData){
         const timeRange = contactsData?.worktime;
         const startHour = parseFloat(timeRange.split(" ")[1]);
         const endHour = parseFloat(timeRange.split("до ")[1]);
         const currentTime = new Date().getHours();

         // if (currentTime >= startHour && currentTime < endHour) {
         //     setWorktime(true)
         // } else {
         //     setWorktime(false)
         // }
     }
    }, [contactsData]);
    const addOrder = () => {
        if (!worktime) {
            setModal(true)
        } else {
            setCheckout(true)
        }
    }

    const handleSwipeEnd = (e:any,index:number) => {
        const itemWidth = e.target.offsetWidth;
        const swipeDistance = e.changedTouches[0].clientX - e.target.getBoundingClientRect().left;

        if ((swipeDistance > itemWidth / 2) && swipeItem) {
            dispatch(deleteSwipeProduct(swipeItem))
        }
        if (productRef.current) {
            productRef.current[index].style.transform = `translateX(${0}px)`;
        }
        setSwipeItem(null);
    };
    const handleSwipeStart = (e:any,item:IProduct,index:number) => {
        const itemWidth = e.target.offsetWidth;
        const swipeDistance = e.changedTouches[0].clientX - e.target.getBoundingClientRect().left;
        setSwipeItem(item)
        if (productRef.current[index]) {
            productRef.current[index].style.transform = `translateX(-${swipeDistance}px)`;
        }
        if (swipeDistance+10 < itemWidth / 2) {
            if (productRef.current[index]) {
                productRef.current[index].style.transform = `translateX(${0}px)`;
            }
        }
    }
    return (
        <MainLayout heading={checkout ? 'Оформление заказа' : 'Корзина'} textCenter>
            {
                checkout ?
                    <FormCheckout/>
                    :
                    <div className={classes.cart}>
                        <div>
                            <div className={classes.list}>
                                {
                                    productsInCart && productsInCart.map((item,index:number) =>
                                        <div
                                            className={classes.item}
                                            ref={(element:any) => productRef.current[index] = element}
                                            key={item.id}
                                            onDrag={(e)=>handleSwipeStart(e,item,index)}
                                            onTouchStart={(e)=>handleSwipeStart(e,item,index)}
                                            onTouchEnd={(e)=>handleSwipeEnd(e,index)}
                                            onTouchMove={(e)=>handleSwipeEnd(e,index)}
                                        >
                                            <Product data={item} inCart count={item.count ? item.count : 0}/>
                                            <div className={classes.divider}></div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className={classes.sum}>
                                <span>Итого: </span>
                                <span>
                                {
                                    productsInCart && productsInCart.reduce((acc, item) => acc + (+item?.price * (item.count ? item.count : 0)), 0)
                                }
                                    ₽
                            </span>
                            </div>
                        </div>
                        <Button onClick={addOrder}>Оформить заказ</Button>
                    </div>
            }
            {modal && createPortal(
                <Modal textModal={`
                К сожалнию в данный момент мы не работаем.\n
                Время работы: ${contactsData.worktime}
                `} onClick={() => setModal(false)}
                       textBtn={'Закрыть'}/>,
                document.body
            )}
        </MainLayout>
    );
};
export default CartPage;



