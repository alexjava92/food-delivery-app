import { MainLayout } from "../../layout/mainLayout";
import React, { memo, useState } from "react";
import { useGetStatisticsQuery } from "../../store/API/ordersApi";
import { Button } from "../../shared/button/button";
import { Calendar } from "../../shared/calendar/calendar";
import classes from "./statisticsPage.module.scss";
import {ButtonGroup} from "../../shared/button/buttonGroup/buttonGroup";
import {CalendarCheck, CalendarClock, CalendarDays, CalendarRange, Timer, History} from "lucide-react";

const StatisticsPage = memo(() => {
    const date = new Date();
    const today = new Date();
    today.setHours(10, 0, 0, 0);

    const startOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfPreviousMonth = new Date(startOfCurrentMonth.getTime() - 1);

    const [catId, setCatId] = useState('');
    const [endTime, setEndTime] = useState(date);
    const [startTime, setStartTime] = useState(date);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [btnId, setBtnId] = useState(0);
    const { data } = useGetStatisticsQuery({ startTime, endTime, catId });

    const handler = (start: any, end: any, btnId: number) => {
        setStartTime(start);
        setEndTime(end);
        setBtnId(btnId);
    };

    return (
        <MainLayout heading={'Статистика'} textCenter>




            <ButtonGroup
                items={[
                    {
                        label: "Сегодня",
                        active: btnId === 1,
                        onClick: () => handler(today, date, 1),
                    },
                    {
                        label: "Вчера",
                        active: btnId === 2,
                        onClick: () =>
                            handler(
                                new Date(new Date(date.setDate(date.getDate() - 1)).setHours(0, 0, 0, 0)),
                                new Date(new Date(date.setDate(date.getDate())).setHours(23, 59, 59, 999)),
                                2
                            ),
                    },
                    {
                        label: "За 7 дней",
                        active: btnId === 3,
                        onClick: () =>
                            handler(
                                new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7),
                                date,
                                3
                            ),
                    },
                    {
                        label: "Этот месяц",
                        active: btnId === 4,
                        onClick: () =>
                            handler(
                                new Date(date.getFullYear(), date.getMonth(), 1),
                                new Date(date.getFullYear(), date.getMonth() + 1, 0),
                                4
                            ),
                    },
                    {
                        label: "Предыдущий месяц",
                        active: btnId === 5,
                        onClick: () =>
                            handler(
                                new Date(endOfPreviousMonth.getFullYear(), endOfPreviousMonth.getMonth(), 1),
                                new Date(startOfCurrentMonth.getTime() - 1),
                                5
                            ),
                    },
                    {
                        label: "За год",
                        active: btnId === 6,
                        onClick: () =>
                            handler(
                                new Date(today.getFullYear(), 0, 1),
                                new Date(today.getFullYear(), 11, 31),
                                6
                            ),
                    },
                ]}
            />





            <div className={classes.box}>
                <div className={classes.calendarBox}>
                    <Calendar changeDate={setStartDate} formatISO />
                    -
                    <Calendar changeDate={setEndDate} formatISO />
                </div>
                <Button
                    className={classes.compact}
                    size="small"
                    active={btnId === 7}
                    onClick={() => handler(
                        new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                        new Date(new Date(endDate).setHours(23, 59, 59, 999)),
                        7
                    )}
                >
                    Применить
                </Button>
            </div>
            <div className="mb-4">
                {catId && <Button className={classes.compact} size="small" color="danger" onClick={() => setCatId('')}>Назад</Button>}
            </div>

            <div className={classes.mainStatsRow}>
                <div>
                    <span className={classes.statLabel}>Выручка: </span>
                    <span className={classes.statValue}>{data?.gain} ₽</span>
                </div>
                <div>
                    <span className={classes.statLabel}>Заказы: </span>
                    <span className={classes.statValue}>{data?.countOfOrders} шт</span>
                </div>
                <div>
                    <span className={classes.statLabel}>Средний чек: </span>
                    <span className={classes.statValue}>{data?.averageCheck} ₽</span>
                </div>
                {(data?.delivery?.count > 0 || data?.delivery?.total > 0 || data?.pickupCount > 0) && (
                    <div className={classes.mainStatsCol}>
                        <div className={classes.mainStatsTitle}>Доставка и самовывоз</div>

                        <div className={classes.statGroup}>
                            {data?.delivery?.count > 0 && (
                                <div className={classes.statRow}>
                                    <span className={classes.statLabel}>Доставки:</span>
                                    <span className={classes.statValue}>{data.delivery.count} шт</span>
                                </div>
                            )}
                            {data?.delivery?.total > 0 && (
                                <div className={classes.statRow}>
                                    <span className={classes.statLabel}>Сумма доставок:</span>
                                    <span className={classes.statValue}>{data.delivery.total} ₽</span>
                                </div>
                            )}
                            {data?.pickupCount > 0 && (
                                <div className={classes.statRow}>
                                    <span className={classes.statLabel}>Самовывоз:</span>
                                    <span className={classes.statValue}>{data.pickupCount} шт</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>



            <div className={classes.statsGrid}>
                {data?.stat.map((item: any) => (
                    <div
                        key={item?.title}
                        className={`${classes.card} ${item?.id ? classes.clickable : ''}`}
                        onClick={() => item?.id && setCatId(item?.id)}
                    >
                        <span className={classes.title}>{item?.title}</span>
                        <span className={classes.value}>{item?.count} шт</span>
                    </div>
                ))}
            </div>

        </MainLayout>
    );
});

export default StatisticsPage;
