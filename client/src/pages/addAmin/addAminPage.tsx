import {MainLayout} from "../../layout/mainLayout"
import {useGetAllUsersQuery, useUpdateUserMutation} from "../../store/API/userApi";
import classes from "../changeStatusOrder/changeStatusOrderPage.module.scss";
import {Button} from "../../shared/button/button";
import React, {useEffect, useState} from "react";
import {Loader} from "../../shared/loader/loader";
import {Search} from "../../entities/search/search";
import {IUser} from "../../types/types";

export const roles =[
    {id:1,role:'admin',name:'Администратор'},
    {id:2,role:'user',name:'Пользователь'},
    {id:3,role:'cashier',name:'Кассир'},
    {id:4,role:'cook',name:'Повар'},
]
const AddAminPage = () => {
    const {data} = useGetAllUsersQuery('')
    const [updateUser, {data: dataUpdateUser, isLoading, error}] = useUpdateUserMutation()
    const [select, setSelect] = useState('')
    const [userId, setUserId] = useState('')
    const [usersSearch, setUsersSearch] = useState([])

    const handlerSubmit = () => {
        updateUser({
            userId,
            body: {
                role: select,
            }
        })
    }
    const handlerSelect = (id: string, role: string) => {
        setUserId(id)
        setSelect(role)
    }
    return (
        <MainLayout heading={'Изменение роли пользователя'}>
            <Search url={'user/search?name'} callback={setUsersSearch}/>
            <div className={classes.list}>

                {
                    isLoading && <Loader circle/>
                }
                {usersSearch?.length > 0 && <h3>Все пользователи</h3>}

                {
                    usersSearch?.length > 0 &&
                    usersSearch.map((item: any) =>
                        <div className={classes.box} key={item?.id}>
                            <div className={classes.item}>
                                <div className={classes.title}>Пользователь:</div>
                                <div className={classes.title}>
                                    {item?.id}
                                    &nbsp;|&nbsp;
                                    {item?.username ? item?.username : item?.chatId}
                                    &nbsp;|&nbsp;
                                    {item?.name}
                                </div>
                            </div>
                            <div className={classes.inner}>
                                <select onChange={(e) => handlerSelect(item?.id, e.target.value)} defaultValue={item.role}>
                                    {
                                        roles.map(item =>
                                            <option key={item.id} value={item.role}>{item.name}</option>
                                        )
                                    }
                                </select>
                                <Button onClick={handlerSubmit}>Сохранить</Button>
                            </div>
                        </div>
                    )
                }
                <h3>Администраторы</h3>
                {
                    data && data.map((item: any) =>

                        item.role !== 'user' ?
                            <div className={classes.box} key={item?.id}>
                                <div className={classes.item}>
                                    <div className={classes.title}>Пользователь:</div>
                                    <div className={classes.title}>
                                        {item?.username ? item?.username : item?.chatId}
                                    </div>
                                </div>
                                <div className={classes.inner}>
                                    <select onChange={(e) => handlerSelect(item?.id, e.target.value)} defaultValue={item.role}>
                                        {
                                            roles.map(item =>
                                                <option key={item.id} value={item.role}>{item.name}</option>
                                            )
                                        }
                                    </select>
                                    <Button onClick={handlerSubmit}>Сохранить</Button>
                                </div>
                            </div>
                            : null
                    )
                }
            </div>
        </MainLayout>
    )
        ;
};
export default AddAminPage;
