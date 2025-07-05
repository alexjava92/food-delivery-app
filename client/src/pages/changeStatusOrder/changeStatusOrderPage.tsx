import {MainLayout} from "../../layout/mainLayout";
import {
    useGetOrdersQuery,
    useUpdateOrderStatusMutation,
    ordersApi,
} from "../../store/API/ordersApi";
import React, {useEffect, useState} from "react";
import classes from "./changeStatusOrderPage.module.scss";
import {NavLink} from "react-router-dom";
import {Button} from "../../shared/button/button";
import {Select} from "../../shared/select/select";
import {Loader} from "../../shared/loader/loader";
import {createPortal} from "react-dom";
import {Modal} from "../../entities/modal/modal";
import {useAppDispatch} from "../../hooks/useRedux";
import {Store, Truck} from "lucide-react";
import {useWebSocket} from "../../hooks/useWebSocket";




const variants = ["новый", "готовится", "готово к выдаче", "выдано", "отменен"];

const ChangeStatusOrderPage = () => {
    const [page, setPage] = useState(1);
    const {data, isError, isLoading} = useGetOrdersQuery(page);
    const [updateStatus, {data: dataUpdate, isError: isErrorUpdate, isLoading: isLoadingUpdate}] =
        useUpdateOrderStatusMutation();
    const dispatch = useAppDispatch();

    const [selectMap, setSelectMap] = useState<Record<string, string>>({});
    const [modal, setModal] = useState(false);
    const [textModal, setTextModal] = useState("");

    // получаем userId безопасно (можно с fallback на null)
    const userId: number | undefined = data?.rows?.[0]?.user?.id ?? undefined;

    const { subscribe } = useWebSocket(userId);

    useEffect(() => {
        if (!userId) return;

        const handler = (payload: any) => {
            console.log("📡 Обновление заказа по WS:", payload);
            dispatch(ordersApi.util.invalidateTags([{ type: "Orders" }]));
        };

        subscribe("order-notification", handler);

        return () => {
            subscribe("order-notification", handler);
        };
    }, [userId]);

    useEffect(() => {
        if (!data) return;

        const updatedMap: Record<string, string> = {};

        data.rows.forEach(order => {
            updatedMap[String(order.id)] = order.status ?? "новый"; // <- безопасно
        });

        setSelectMap(updatedMap);
    }, [data]);


    /*useEffect(() => {
        console.log("data:", data);
    }, [data]);*/

   /* useEffect(() => {
        data?.rows.forEach((order) => {
            console.log(`ID: ${order.id}, type: ${order.typeDelivery}`);
        });
    }, [data]);*/

    useEffect(() => {
        if (isErrorUpdate) {
            setTextModal("Ошибка при обновлении статуса");
            setModal(true);
        } else if (dataUpdate) {
            setTextModal("Статус обновлен");
            setModal(true);
        }
    }, [dataUpdate, isErrorUpdate]);

    useEffect(() => {
        if (modal) {
            const timer = setTimeout(() => setModal(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [modal]);


    const handlerSubmit = (
        id: number | string,
        chatId: number | string,
        userId: number | string
    ) => {
        const selectedStatus = selectMap[String(id)];

        updateStatus({
            id,
            body: {
                status: selectedStatus,
                notifications: true,
                chatId,
                userId,
            },
        }).then(() => {
            dispatch(ordersApi.util.invalidateTags([{type: "Orders", id: userId}]));
            dispatch(
                ordersApi.endpoints.getAllOrdersUser.initiate(userId, {forceRefetch: true})
            );
        });
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "новый":
                return classes.new;
            case "готовится":
                return classes.processing;
            case "готово к выдаче":
                return classes.ready;
            case "выдано":
                return classes.issued;
            case "отменен":
                return classes.cancelled;
            default:
                return "";
        }
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
                {isLoadingUpdate && <Loader circle/>}
                {isLoading && <Loader height={118}/>}
                {data &&
                    data?.rows.map((item) => (
                        <div
                            className={`${classes.box} ${classes.statusBox} ${getStatusClass(item?.status ?? "")}`}

                            key={item?.id}
                        >
                            <div className={classes.item}>

                                <div className={classes.title}>
                                    <span>Заказ №{item?.id}</span>
                                    {item?.typeDelivery === "Доставка" && <Truck size={24} color='red' />}
                                    {item?.typeDelivery === "Самовывоз" && <Store size={24} color='gold' />}
                                </div>

                                <Select
                                    onChange={(val) =>
                                        setSelectMap((prev) => ({
                                            ...prev,
                                            [String(item.id)]: val,
                                        }))
                                    }
                                    dataOption={variants}
                                    initValue={selectMap[String(item.id)] ?? item.status}

                                />
                            </div>
                            <div className={classes.inner}>
                                <NavLink className={classes.link} to={`/order/${item.id}`}>
                                    Перейти в заказ
                                </NavLink>
                                <Button
                                    disabled={
                                        selectMap[String(item.id)] === item?.status ||
                                        !selectMap[String(item.id)]
                                    }
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
