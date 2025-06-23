import { MainLayout } from "../../layout/mainLayout";
import React, { useEffect, useState } from "react";
import { Button } from "../../shared/button/button";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery, useUpdateRoleUserMutation } from "../../store/API/userApi";
import { Select } from "../../shared/select/select";
import { roles } from "../addAmin/addAminPage";
import classes from "./UpdateRoleUserPage.module.scss";

const UpdateRoleUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isLoading: isUserLoading } = useGetUserQuery(id);
    const [update, { data: dataUpdateUser, isLoading, error }] = useUpdateRoleUserMutation();
    const [selectedRole, setSelectedRole] = useState("");

    useEffect(() => {
        if (dataUpdateUser && !isLoading && !error) {
            navigate("/");
        }
    }, [dataUpdateUser, isLoading, error, navigate]);

    const handleUpdate = () => {
        if (selectedRole) {
            update({ id, body: { role: selectedRole } });
        }
    };

    return (
        <MainLayout heading="Обновление роли">
            {isUserLoading ? (
                <div>Загрузка...</div>
            ) : (
                <div className={classes.container}>
                    <p className={classes.userInfo}>
                        Изменить роль пользователя <strong>{data?.username}</strong> (ID: {id})
                    </p>
                    <Select
                        dataOption={roles.map(({ role }) => role)}
                        onChange={setSelectedRole}
                        initValue={selectedRole || ""}
                    />
                    <Button
                        onClick={handleUpdate}
                       /* disabled={!selectedRole || isLoading}*/
                        /*className={classes.button}*/
                    >
                        {isLoading ? "Обновление..." : "Изменить"}
                    </Button>
                </div>
            )}
        </MainLayout>
    );
};

export default UpdateRoleUserPage;