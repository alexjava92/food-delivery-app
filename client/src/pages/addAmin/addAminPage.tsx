import { MainLayout } from "../../layout/mainLayout";
import { useGetAllUsersQuery, useUpdateUserMutation } from "../../store/API/userApi";
import classes from "../changeStatusOrder/changeStatusOrderPage.module.scss";
import { Button } from "../../shared/button/button";
import React, { useEffect, useState } from "react";
import { Loader } from "../../shared/loader/loader";
import { Search } from "../../entities/search/search";
import { Modal } from "../../entities/modal/modal";

export const roles = [
    { id: 0, role: "", name: "Все" },
    { id: 1, role: "admin", name: "Администратор" },
    { id: 2, role: "user", name: "Пользователь" },
    { id: 3, role: "cashier", name: "Кассир" },
    { id: 4, role: "cook", name: "Повар" },
];

const AddAminPage = () => {
    const { data: allUsers } = useGetAllUsersQuery("");
    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const [searchResults, setSearchResults] = useState([]);
    const [selectedRoleFilter, setSelectedRoleFilter] = useState("");
    const [editedRoles, setEditedRoles] = useState<Record<string, string>>({});
    const [modal, setModal] = useState(false);
    const [modalText, setModalText] = useState("");

    const users = searchResults.length > 0 ? searchResults : allUsers || [];

    const filteredUsers = users.filter((user: any) =>
        selectedRoleFilter ? user.role === selectedRoleFilter : true
    );

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
                    onChange={(e) => setSelectedRoleFilter(e.target.value)}
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
                {filteredUsers.map((user: any) => {
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
