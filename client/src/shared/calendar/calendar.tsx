import React, { FC, memo, useEffect, useState } from "react";
import classes from './calendar.module.scss';
import { Select } from "../select/select";

interface IType {
    changeDate: (val: string) => void;
    formatISO?: boolean;
}

const monthArr = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// Получаем сегодняшнюю дату
const today = new Date();
const currentDay = String(today.getDate()).padStart(2, '0');
const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
const currentYear = today.getFullYear();

export const Calendar: FC<IType> = memo(({ changeDate, formatISO }) => {
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedDate, setSelectedDate] = useState(`${currentDay}.${currentMonth}.${currentYear}`);
    const [countDay, setCountDay] = useState(31);
    const [active, setActive] = useState(false);

    useEffect(() => {
        setCountDay(new Date(selectedYear, +selectedMonth, 0).getDate());
        setSelectedDate(`${selectedDay}.${selectedMonth}.${selectedYear}`);
        if (formatISO) {
            changeDate(`${selectedYear}-${selectedMonth}-${selectedDay}`);
        } else {
            changeDate(`${selectedDay}.${selectedMonth}.${selectedYear}`);
        }
    }, [selectedDay, selectedMonth, selectedYear]);

    const handlerYear = (val: any) => {
        setSelectedYear(val);
    };

    const handlerMonth = (val: any) => {
        const monthNum = +val + 1;
        setSelectedMonth(monthNum < 10 ? `0${monthNum}` : `${monthNum}`);
    };

    const handlerDay = (day: any) => {
        setSelectedDay(day < 10 ? `0${day}` : `${day}`);
    };

    return (
        <div className={active ? `${classes.calendar} ${classes.active}` : classes.calendar}>
            <div className={classes.overlay} onClick={() => setActive(false)}></div>
            <div className={classes.selectedDate} onClick={() => setActive(true)}>{selectedDate}</div>
            {
                active &&
                <div className={classes.item}>
                    <div className={classes.box}>
                        <Select
                            initValue={selectedYear}
                            dataOption={Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)}
                            onChange={handlerYear}
                        />
                        <Select
                            initValue={monthArr[+selectedMonth - 1]}
                            dataOption={monthArr}
                            onChange={(e) => handlerMonth(monthArr.indexOf(e))}
                        />
                    </div>
                    <div className={classes.days}>
                        {
                            Array.from({ length: countDay }, (_, i) => i + 1).map(day =>
                                <div
                                    key={day}
                                    className={
                                        day === +selectedDay
                                            ? `${classes.dayItem} ${classes.active}`
                                            : classes.dayItem
                                    }
                                    onClick={() => handlerDay(day)}
                                >
                                    {day}
                                </div>
                            )
                        }
                    </div>
                </div>
            }
        </div>
    );
});
