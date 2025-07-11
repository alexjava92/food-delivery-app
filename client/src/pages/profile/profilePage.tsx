import classes from './profilePage.module.scss'
import {MainLayout} from "../../layout/mainLayout"
import {Calendar} from "../../shared/calendar/calendar";
import {useInput} from "../../hooks/useInput";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {SimpleTextField} from "../../shared/simpleTextField/simpleTextField";
import {useUpdateUserMutation} from "../../store/API/userApi";
import {Button} from "../../shared/button/button";
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import {createPortal} from "react-dom";
import {Modal} from "../../entities/modal/modal";
import {Loader} from "../../shared/loader/loader";
import {fetchUser, updateLocalUser} from "../../store/slice/userSlice";


const ProfilePage = () => {
    const {user} = useAppSelector((state) => state.userReducer);
    useEffect(() => {}, [user]);
    const [updateUser, {data, isLoading, isError}] = useUpdateUserMutation()

    const nameInput = useInput(user.name)
    const emailInput = useInput(user.email)
    const phoneInput = useInput(user.phone || '')

    useEffect(() => {
        if (user) {
            nameInput.setValue(user.name || '');
            emailInput.setValue(user.email || '');
            phoneInput.setValue(user.phone || '');
        }
    }, [user]);

    const [date, setDate] = useState('')
    const [gender, setGender] = useState({id: 1, text: 'Мужской'})
    const [modal, setModal] = useState(false)
    const [textModal, setTextModal] = useState('')
    const dispatch = useAppDispatch();



    useEffect(() => {
        if (isError) {
            setTextModal('Ошибка при обновлении профиля')
        } else {
            setTextModal('Профиль обновлен')
        }
        if (data) setModal(true)
    }, [data])

    const handlerSave = () => {
        updateUser({
            userId: user?.id,
            body: {
                name: nameInput.value,
                email: emailInput.value,
                gender: gender.text,
                birthdate: date,
                phone: phoneInput.value,
            }
        }).unwrap().then(() => {
            dispatch(updateLocalUser({
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
            }));
        });
    };

    return (
        <MainLayout heading={'Профиль'} textCenter>
            <form onSubmit={(e) => e.preventDefault()}>
                {isLoading && <Loader circle/>}
                <div className={classes.title}>Имя</div>
                <div className={classes.box}>
                    <SimpleTextField placeholder={'Имя'} onChange={nameInput.onChange} value={nameInput.value}
                                     borderAccent/>
                   {/* <SimpleTextField placeholder={'Почта'} onChange={emailInput.onChange} value={emailInput.value}
                                     borderAccent/>*/}
                </div>
                {/*<div className={classes.title}>Пол</div>
                <div className={classes.genderGroup}>
                    <button
                        className={gender.id === 1 ? `${classes.btn} ${classes.active}` : classes.btn}
                        onClick={() => setGender({id: 1, text: 'Мужской'})}>
                        Мужской
                    </button>
                    <button
                        className={gender.id === 2 ? `${classes.btn} ${classes.active}` : classes.btn}
                        onClick={() => setGender({id: 2, text: 'Женский'})}>
                        Женский
                    </button>
                </div>*/}
                {/*<div className={classes.calendar}>
                    <div className={classes.title}>Дата рождения</div>
                    <Calendar changeDate={setDate}/>
                </div>*/}
                <div className={classes.title}>Телефон</div>
                <div className="mb-4">
                    <SimpleTextField
                        type={'phone'}
                        placeholder={'Телефон'}
                        onChange={phoneInput.onChange}
                        value={phoneInput.value}
                        borderAccent/>
                </div>
                {
                    (nameInput.visible || emailInput.visible || phoneInput.visible) &&
                    <Button onClick={handlerSave}>Сохранить</Button>
                }

            </form>
            {modal && createPortal(
                <Modal textModal={textModal} onClick={() => setModal(false)}
                       textBtn={'Закрыть'}/>,
                document.body
            )}
        </MainLayout>
    );
};
export default ProfilePage;
