import { MainLayout } from "../../layout/mainLayout";
import {
    useGetAllUsersQuery,
    useGetUsersByRoleQuery,
    useUpdateUserMutation,
} from "../../store/API/userApi";
import React, { useEffect, useState } from "react";
import { Loader } from "../../shared/loader/loader";
import { Search } from "../../entities/search/search";
import { Modal } from "../../entities/modal/modal";

import classes from "./AddAminPage.module.scss";
import { IUser } from "../../types/types";
import {RoleFilter} from "../../shared/roleFilter/RoleFilter";
import {UserCard} from "../../shared/userCard/UserCard";

const roles = [
    { id: 0, role: "", name: "Все" },
    { id: 1, role: "superAdmin", name: "СуперАдмин" },
    { id: 2, role: "admin", name: "Администратор" },
    { id: 3, role: "user", name: "Пользователь" },
    { id: 4, role: "cashier", name: "Кассир" },
    { id: 5, role: "cook", name: "Повар" },
];

const AddAminPage = () => {
    const [selectedRoleFilter, setSelectedRoleFilter] = useState("");
    const [searchResults, setSearchResults] = useState<IUser[]>([]);
    const [editedRoles, setEditedRoles] = useState<Record<string, string>>({});
    const [modal, setModal] = useState(false);
    const [modalText, setModalText] = useState("");

    const { data: allUsers, refetch: refetchAll } = useGetAllUsersQuery("");
    const { data: roleUsers, refetch: refetchRole } = useGetUsersByRoleQuery(
        selectedRoleFilter,
        { skip: !selectedRoleFilter }
    );
    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const users: IUser[] =
        Array.isArray(searchResults) && searchResults.length > 0
            ? searchResults
            : selectedRoleFilter
                ? roleUsers || []
                : allUsers || [];

    const handleRoleChange = (userId: string, newRole: string) => {
        setEditedRoles((prev) => ({
            ...prev,
            [userId]: newRole,
        }));
    };

    const handleSave = async (userId: string) => {
        const role = editedRoles[userId];
        try {
            await updateUser({ userId, body: { role } }).unwrap();
            setModalText("Роль успешно обновлена");
            setModal(true);
            setEditedRoles((prev) => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
            });
            selectedRoleFilter ? refetchRole() : refetchAll();
        } catch {
            setModalText("Ошибка при обновлении роли");
            setModal(true);
        }
    };

    useEffect(() => {
        if (modal) {
            const timer = setTimeout(() => setModal(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [modal]);

    return (
        <MainLayout heading={"Изменение роли пользователя"}>
            <Search url={"user/search?name"} callback={setSearchResults} />

            <RoleFilter
                roles={roles}
                selected={selectedRoleFilter}
                onSelect={(value) => {
                    setSelectedRoleFilter(value);
                    setSearchResults([]);
                }}
            />

            <div className={classes.list}>
                {isLoading && <Loader circle />}
                {users.map((user: IUser) => (
                    <UserCard
                        key={user.id}
                        id={String(user.id)}
                        username={user.username || ""}
                        chatId={String(user.chatId) || ""}
                        name={user.name}
                        role={user.role || ""}
                        currentEdited={editedRoles[String(user.id)]}
                        roles={roles}
                        onChange={handleRoleChange}
                        onSave={handleSave}
                    />
                ))}
            </div>

            {modal && (
                <Modal
                    textModal={modalText}
                    onClick={() => setModal(false)}
                    textBtn={"Закрыть"}
                />
            )}
        </MainLayout>
    );
};

export default AddAminPage;