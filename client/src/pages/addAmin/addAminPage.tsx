import { MainLayout } from "../../layout/mainLayout";
import {
    useGetAllUsersQuery,
    useGetUsersByRoleQuery,
    useUpdateUserMutation,
} from "../../store/API/userApi";
import classes from "../changeStatusOrder/changeStatusOrderPage.module.scss";
import { Button } from "../../shared/button/button";
import React, { useEffect, useState } from "react";
import { Loader } from "../../shared/loader/loader";
import { Search } from "../../entities/search/search";
import { Modal } from "../../entities/modal/modal";

export const roles = [
    { id: 0, role: "", name: "Все" },
    { id: 1, role: "superAdmin", name: "СуперАдмин" },
    { id: 2, role: "admin", name: "Администратор" },
    { id: 3, role: "user", name: "Пользователь" },
    { id: 4, role: "cashier", name: "Кассир" },
    { id: 5, role: "cook", name: "Повар" },

];

const AddAminPage = () => {
    const [selectedRoleFilter, setSelectedRoleFilter] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [editedRoles, setEditedRoles] = useState<Record<string, string>>({});
    const [modal, setModal] = useState(false);
    const [modalText, setModalText] = useState("");

    const { data: allUsers, refetch: refetchAll } = useGetAllUsersQuery("");
    const { data: roleUsers, refetch: refetchRole } = useGetUsersByRoleQuery(
        selectedRoleFilter,
        { skip: !selectedRoleFilter }
    );
    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const users =
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
            await updateUser({
                userId,
                body: { role },
            }).unwrap();
            setModalText("Роль успешно обновлена");
            setModal(true);
            setEditedRoles((prev) => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
            });

            selectedRoleFilter ? refetchRole() : refetchAll();
        } catch (e) {
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

            <div style={{ margin: "10px 0" }}>
                <select
                    value={selectedRoleFilter}
                    onChange={(e) => {
                        setSelectedRoleFilter(e.target.value);
                        setSearchResults([]); // сбрасываем поиск при смене фильтра
                    }}
                >
                    {roles.map((r) => (
                        <option key={r.id} value={r.role}>
                            {r.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={classes.list}>
                {isLoading && <Loader circle />}
                {users.map((user: any) => {
                    const currentEdited = editedRoles[user.id];
                    const roleChanged = currentEdited && currentEdited !== user.role;
                    return (
                        <div className={classes.box} key={user.id}>
                            <div className={classes.item}>
                                <div className={classes.title}>Пользователь:</div>
                                <div className={classes.title}>
                                    {user.id} | {user.username || user.chatId} | {user.name}
                                </div>
                            </div>
                            <div className={classes.inner}>
                                <select
                                    value={currentEdited ?? user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    {roles
                                        .filter((r) => r.role !== "")
                                        .map((r) => (
                                            <option key={r.id} value={r.role}>
                                                {r.name}
                                            </option>
                                        ))}
                                </select>
                                <Button disabled={!roleChanged} onClick={() => handleSave(user.id)}>
                                    Сохранить
                                </Button>
                            </div>
                        </div>
                    );
                })}
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
