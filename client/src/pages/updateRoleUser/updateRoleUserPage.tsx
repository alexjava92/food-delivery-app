
import {MainLayout} from "../../layout/mainLayout"
import classes from "../../entities/search/search.module.scss";
import React, {useEffect, useState} from "react";
import {TextField} from "../../shared/textField/textField";
import {useInput} from "../../hooks/useInput";
import {useGetUserQuery, useUpdateRoleUserMutation} from "../../store/API/userApi";
import {Button} from "../../shared/button/button";
import {useNavigate, useParams} from "react-router-dom";
import {roles} from "../addAmin/addAminPage";


const UpdateRoleUserPage = () => {
    const navigate = useNavigate();
    const {id} = useParams()
    const {data, refetch } = useGetUserQuery(`${id}`)
    const [update,{data:dataUpdateUser,isLoading,error}]=useUpdateRoleUserMutation()
    const [select, setSelect] = useState('')
    useEffect(() => {
        if(dataUpdateUser && !isLoading && !error){
            navigate(`/`)
        }
    }, [isLoading,error]);
    const handler = () => {
        update({
            id,
            body: {
                role: select,
            }
        }).unwrap().then(() => {
            refetch(); // обновляем данные пользователя
        });
    };
    return (
        <MainLayout heading={'Обновление роли пользователя'}>
            <div className="mb-4">
                Изменить роль пользователя {data?.username} с ID {id} на
                <select onChange={(e) => setSelect(e.target.value)}>
                    {
                        roles.map(item =>
                            <option key={item.id} value={item.role}>{item.name}</option>
                        )
                    }
                </select>
            </div>
            <Button onClick={handler}>Изменить</Button>
        </MainLayout>
    );
};
export default UpdateRoleUserPage;
