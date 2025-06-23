import React, {FC, memo, useEffect, useState} from "react";
import classes from "./formCheckout.module.scss";
import {Button} from "../../shared/button/button";
import {SimpleTextField} from "../../shared/simpleTextField/simpleTextField";
import {useInput} from "../../hooks/useInput";
import {InputRadio} from "../../shared/inputRadio/inputRadio";
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import {useCreateNewOrderMutation} from "../../store/API/ordersApi";
import {useNavigate} from "react-router-dom";
import {IOrderCreate} from "../../types/types";
import {BtnGroup} from "../../shared/btnGroup/btnGroup";
import {useUpdateUserMutation} from "../../store/API/userApi";
import {createPortal} from "react-dom";
import {Modal} from "../modal/modal";
import {deleteProductInCart} from "../../store/slice/productsSlice";
import {Loader} from "../../shared/loader/loader";
import {TextField} from "../../shared/textField/textField";

interface IType {

}

export const FormCheckout: FC<IType> = memo(() => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch()
    const {user} = useAppSelector((state) => state.userReducer);

    const [createOrder, {data: dataCreate, error, isLoading}] = useCreateNewOrderMutation()
    const [updateUser] = useUpdateUserMutation()

    const {productsInCart} = useAppSelector(state => state.productReducer)

    const address = useInput(user?.address ? user?.address : '')
    const phone = useInput(user?.phone ? user?.phone : '')
    const name = useInput(user?.name ? user?.name : '')
    const commentInput = useInput('')

    const [typeDelivery, setTypeDelivery] = useState('Доставка')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [paymentMethodError, setPaymentMethodError] = useState(false)
    const [modalError, setModalError] = useState(false)
    useEffect(() => {
        if (error && !isLoading) {
            setModalError(true)
        }
    }, [error, isLoading])

    useEffect(() => {
        if (!error && !isLoading && dataCreate) {
            localStorage.setItem('productsInCart', '')
            navigate(`/order/${dataCreate.id}`)
            dispatch(deleteProductInCart())
        }
    }, [dataCreate])

    const submitHandler = () => {
        const data: IOrderCreate = {
            userId: user?.id,
            address: typeDelivery === 'Доставка' ? address.value :'Самовывоз',
            typeDelivery,
            phone: phone.value,
            name: name.value,
            paymentMethod: typeDelivery === 'Доставка' ? paymentMethod : 'Наличные',
            orderProducts: productsInCart.map(item => ({id: +item?.id, count: +item?.count})),
            status: 'новый',
            comment:commentInput.value
        }
        if (!paymentMethod) setPaymentMethodError(true)
        if (!address.value) address.setError(true)
        if (!phone.value || phone.value.includes('_')) {
            phone.setError(true)
        }
        if (data.address && !data?.phone?.includes('_') && data.paymentMethod) {

            createOrder(data)
            updateUser({
                userId: user?.id,
                body: {
                    address: address.value, phone: phone.value, name: name.value,
                }
            })
        }

    }
    return (
        <form className={classes.formCheckout} onSubmit={(e) => e.preventDefault()}>
            {isLoading && <Loader circle/>}
            <div className={classes.inner}>
                <BtnGroup
                    activeOneBtn={typeDelivery === 'Доставка'}
                    activeTwoBtn={typeDelivery === 'Самовывоз'}
                    onClickOneBtn={() => setTypeDelivery('Доставка')}
                    onClickTwoBtn={() => setTypeDelivery('Самовывоз')}
                    textOneBtn={'Доставка'}
                    textTwoBtn={'Самовывоз'}/>
            </div>
            <div className={classes.box}>
                {
                    typeDelivery === 'Доставка' &&
                    <SimpleTextField label={"Укажите адрес доставки"} value={address.value} onChange={address.onChange} error={address.error}/>
                }
                <SimpleTextField label={"Контакты"} type={'phone'} value={phone.value} onChange={phone.onChange} error={phone.error}/>
                <SimpleTextField label={"Имя"} value={name.value} onChange={name.onChange}/>
                <SimpleTextField label={'Описание'} onChange={commentInput.onChange}
                           value={commentInput.value} description/>
            </div>
            {
                typeDelivery === 'Доставка' &&
                <div className={'mb-4'}>
                    <div className={classes.paymentTitle}>
                        <div>Метод оплаты</div>
                        {paymentMethodError && <div className={'error'}>Выберите метод оплаты</div>}
                    </div>
                    <InputRadio label={'Наличные'} value={'Наличные'} onChange={setPaymentMethod} name={"payment"}/>
                    {/*<InputRadio label={'Эквайринг'} value={'Эквайринг'} onChange={setPaymentMethod} name={"payment"}/>*/}
                    <InputRadio label={'Картой при получении'} value={'Картой при получении'} onChange={setPaymentMethod}
                                name={"payment"}/>
                </div>
            }

            <Button onClick={submitHandler}>Оформить заказ</Button>
            {modalError && createPortal(
                <Modal textModal={'Ошибка при оформлении заказа'} onClick={() => setModalError(false)}
                       textBtn={'Закрыть'} error/>,
                document.body
            )}
        </form>
    );
});
