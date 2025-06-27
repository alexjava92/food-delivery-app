import {MainLayout} from "../../layout/mainLayout"
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import {Product} from "../../entities/product/product";
import React, {useEffect, useState} from "react";
import classes from "./cartPage.module.scss"
import {Button} from "../../shared/button/button";
import {FormCheckout} from "../../entities/formCheckout/formCheckout";
import {useGetContactsQuery} from "../../store/API/contactsApi";
import {createPortal} from "react-dom";
import {Modal} from "../../entities/modal/modal";


const CartPage = () => {
    const dispatch = useAppDispatch();
    const {data: contactsData} = useGetContactsQuery('')
    const {productsInCart} = useAppSelector(state => state.productReducer)
    const [checkout, setCheckout] = useState(false)
    const [workTime, setWorkTime] = useState(true)
    const [modal, setModal] = useState(false)
    /*const [swipeItem, setSwipeItem] = useState<IProduct | null>(null);
    const productRef = useRef<any>([])*/
    useEffect(() => {
        if (contactsData?.worktime) {
            const worktime = contactsData.worktime;
            const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
            const today = days[new Date().getDay()];

            // Найдём строку, соответствующую сегодняшнему дню
            let timeMatch = '';

            if (['Пн', 'Вт', 'Ср', 'Чт', 'Пт'].includes(today)) {
                const match = worktime.match(/Пн-Пт\s*с\s*(\d{1,2}):\d{2}\s*-\s*(\d{1,2}):\d{2}/);
                if (match) timeMatch = match[0];
            } else if (['Сб', 'Вс'].includes(today)) {
                const match = worktime.match(/Сб-Вс\s*с\s*(\d{1,2}):\d{2}\s*-\s*(\d{1,2}):\d{2}/);
                if (match) timeMatch = match[0];
            }

            const match = timeMatch.match(/с\s*(\d{1,2}):\d{2}\s*-\s*(\d{1,2}):\d{2}/);

            if (match) {
                const startHour = Number(match[1]);
                const endHour = Number(match[2]) === 24 ? 0 : Number(match[2]); // 24:00 → 00:00 следующего дня
                const currentHour = new Date().getHours();

                const isWorking = startHour < endHour
                    ? currentHour >= startHour && currentHour < endHour
                    : currentHour >= startHour || currentHour < endHour;

                setWorkTime(isWorking);
            } else {
                console.warn("Не удалось распарсить часы из строки:", contactsData.worktime);
                setWorkTime(true); // по умолчанию — работаем
            }
        }
    }, [contactsData]);


    const addOrder = () => {
        if (!workTime) {
            setModal(true)
        } else {
            setCheckout(true)
        }
    }

    /*const handleSwipeEnd = (e:any,index:number) => {
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
    }*/
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
                                    productsInCart && productsInCart.map((item, index: number) =>
                                        <div
                                            className={classes.item}
                                            key={item.id}
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
                К сожалению в данный момент мы не работаем.\n
                Время работы: ${contactsData.worktime}
                `} onClick={() => setModal(false)}
                       textBtn={'Закрыть'}/>,
                document.body
            )}
        </MainLayout>
    );
};
export default CartPage;



