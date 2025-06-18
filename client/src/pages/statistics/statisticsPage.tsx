import {MainLayout} from "../../layout/mainLayout"
import React, {memo, useState} from "react";
import {useGetStatisticsQuery} from "../../store/API/ordersApi";
import {Button} from "../../shared/button/button";
import {Calendar} from "../../shared/calendar/calendar";
import classes from "./statisticsPage.module.scss"

const StatisticsPage = memo(() => {
    const date = new Date();
    const today = new Date();
    today.setHours(10, 0, 0, 0);

    const startOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfPreviousMonth = new Date(startOfCurrentMonth.getTime() - 1);


    const [catId, setCatId] = useState('')
    const [endTime, setEndTime] = useState(date)
    const [startTime, setStartTime] = useState(date)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [btnId, setBtnId] = useState(0)
    const {data} = useGetStatisticsQuery({startTime, endTime, catId})

    const handler = (start: any, end: any, btnId: number) => {
        setStartTime(start)
        setEndTime(end)
        setBtnId(btnId)
    }
    return (
        <MainLayout heading={'Статистика'} textCenter>
            <div className="mb-4">
                {catId && <Button onClick={() => setCatId('')}>Назад</Button>}
            </div>

            <div className={classes.box}>
                <Button active={btnId === 1} onClick={() => handler(today, date, 1)}>Сегодня</Button>
                <Button
                    active={btnId === 2}
                    onClick={() => handler(
                        new Date(new Date(date.setDate(date.getDate() - 1)).setHours(0, 0, 0, 0)),
                        new Date(new Date(date.setDate(date.getDate() - 1)).setHours(23, 59, 59, 999)),
                        2
                    )}>
                    Вчера
                </Button>
                <Button
                    active={btnId === 3}
                    onClick={() => handler(
                        new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7),
                        date,
                        3
                    )}>
                    За 7 дней
                </Button>
                <Button
                    active={btnId === 4}
                    onClick={() => handler(
                        new Date(date.getFullYear(), date.getMonth(), 1),
                        new Date(date.getFullYear(), date.getMonth() + 1, 0),
                        4
                    )}>
                    Этот месяц
                </Button>
                <Button
                    active={btnId === 5}
                    onClick={() => handler(
                        new Date(endOfPreviousMonth.getFullYear(), endOfPreviousMonth.getMonth(), 1),
                        new Date(startOfCurrentMonth.getTime() - 1),
                        5
                    )}>
                    Предыдущий месяц
                </Button>
                <Button
                    active={btnId === 6}
                    onClick={() => handler(
                        new Date(today.getFullYear(), 0, 1),
                        new Date(today.getFullYear(), 11, 31),
                        6
                    )}>
                    За год
                </Button>
            </div>
            <div className={classes.box}>
                <div className={classes.calendarBox}>
                    <Calendar changeDate={setStartDate} formatISO/>
                    -
                    <Calendar changeDate={setEndDate} formatISO/>
                </div>
                <Button
                    active={btnId === 7}
                    onClick={() => handler(
                        new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                        new Date(new Date(endDate).setHours(23, 59, 59, 999)),
                        7
                    )}>
                    Применить
                </Button>
            </div>
            <div className={classes.statsBox}>
                <div className="">
                    <span className={classes.title}>Выручка: </span>
                    <span className={classes.text}>{data?.gain}₽</span>
                </div>
                <div className="">
                    <span className={classes.title}>Количество заказов: </span>
                    <span className={classes.text}>{data?.countOfOrders}шт</span>
                </div>
                <div className="">
                    <span className={classes.title}>Средний чек: </span>
                    <span className={classes.text}>{data?.averageCheck}₽</span>
                </div>
                {
                    data && data?.stat.map((item: any) =>
                        <div className="" onClick={() => {
                            item?.id && setCatId(item?.id)
                        }}>
                            <span className={ item?.id ? `${classes.title} ${classes.category}` :classes.title}>{item?.title}: </span>
                            <span className={classes.text}>{item?.count}шт</span>
                        </div>
                    )
                }
            </div>
        </MainLayout>
    );
});
export default StatisticsPage;
