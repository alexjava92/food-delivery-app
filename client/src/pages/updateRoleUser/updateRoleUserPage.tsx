import { MainLayout } from "../../layout/mainLayout";
import React, { useEffect, useState } from "react";
import { Button } from "../../shared/button/button";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery, useUpdateRoleUserMutation } from "../../store/API/userApi";
import { Select } from "../../shared/select/select"; // Твой компонент
import { roles } from "../addAmin/addAminPage";

const UpdateRoleUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isLoading: isUserLoading } = useGetUserQuery(id);
    const [update, { isLoading, error }] = useUpdateRoleUserMutation();
    const [selectedRole, setSelectedRole] = useState("");

    useEffect(() => {
        if (!isLoading && !error) {
            navigate("/");
        }
    }, [isLoading, error, navigate]);

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
                <div className="flex flex-col gap-4">
                    <p>
                        Изменить роль пользователя <strong>{data?.username}</strong> (ID: {id})
                    </p>
                    <Select
                        dataOption={roles.map(({ role }) => role)}
                        onChange={setSelectedRole}
                        initValue={selectedRole || ""}
                    />
                    <Button
                        onClick={handleUpdate}
                        /*disabled={!selectedRole || isLoading}*/
                    >
                        {isLoading ? "Обновление..." : "Изменить"}
                    </Button>
                </div>
            )}
        </MainLayout>
    );
};

export default UpdateRoleUserPage;