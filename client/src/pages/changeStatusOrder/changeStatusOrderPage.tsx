import { MainLayout } from "../../layout/mainLayout";
import {
    useGetOrdersQuery,
    useUpdateOrderStatusMutation,
    useGetAllOrdersUserQuery,
} from "../../store/API/ordersApi";
import React, { useEffect, useState } from "react";
import classes from "./changeStatusOrderPage.module.scss";
import { NavLink } from "react-router-dom";
import { Button } from "../../shared/button/button";
import { Select } from "../../shared/select/select";
import { Loader } from "../../shared/loader/loader";
import { createPortal } from "react-dom";
import { Modal } from "../../entities/modal/modal";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { setUnreadCount } from "../../store/slice/notificationSlice";
import { ordersApi } from "../../store/API/ordersApi"; // Импортируйте ordersApi

const variants = ["новый", "готовится", "готово к выдаче", "выдано", "отменен"];

const ChangeStatusOrderPage = () => {
    const [page, setPage] = useState(1);
    const { data, isError, isLoading } = useGetOrdersQuery(page);
    const [updateStatus, { data: dataUpdate, isError: isErrorUpdate, isLoading: isLoadingUpdate }] =
        useUpdateOrderStatusMutation();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.userReducer);

    const [select, setSelect] = useState("");
    const [modal, setModal] = useState(false);
    const [textModal, setTextModal] = useState("");

    useEffect(() => {
        if (isErrorUpdate) {
            setTextModal("Ошибка при обновлении статуса");
        } else if (dataUpdate) {
            setTextModal("Статус обновлен");
            setModal(true);
        }
    }, [dataUpdate, isErrorUpdate]);

    const handlerSubmit = (id: number | string, chatId: number | string, userId: number | string) => {
        updateStatus({
            id,
            body: {
                status: select,
                notifications: true,
                chatId,
                userId,
            },
        }).then(() => {
            // Принудительно инвалидировать кэш для userId клиента
            dispatch(
                ordersApi.util.invalidateTags([{ type: "Orders", id: userId }])
            );
        });
    };

    if (isError) {
        return (
            <h2 className={"error"}>
                Произошла ошибка при загрузке данных. Попробуйте обновить страницу
            </h2>
        );
    }

    return (
        <MainLayout heading={"Изменение статуса заказа"}>
            <div className={classes.list}>
                {isLoadingUpdate && <Loader circle />}
                {isLoading && <Loader height={118} />}
                {data &&
                    data?.rows.map((item) => (
                        <div className={classes.box} key={item?.id}>
                            <div className={classes.item}>
                                <div className={classes.title}>Заказ №{item?.id}</div>
                                <Select
                                    onChange={setSelect}
                                    dataOption={variants}
                                    initValue={item?.status}
                                />
                            </div>
                            <div className={classes.inner}>
                                <NavLink className={classes.link} to={`/order/${item.id}`}>
                                    Перейти в заказ
                                </NavLink>
                                <Button
                                    onClick={() =>
                                        handlerSubmit(item?.id, item?.user.chatId, item?.user.id)
                                    }
                                >
                                    Сохранить
                                </Button>
                            </div>
                        </div>
                    ))}
                {data && data?.count >= data?.rows.length && (
                    <Button onClick={() => setPage(page + 1)}>Показать еще</Button>
                )}
            </div>

            {modal &&
                createPortal(
                    <Modal
                        textModal={textModal}
                        onClick={() => setModal(false)}
                        textBtn={"Закрыть"}
                    />,
                    document.body
                )}
        </MainLayout>
    );
};

export default ChangeStatusOrderPage;