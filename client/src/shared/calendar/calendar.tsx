import React, {FC, memo, useEffect, useState} from "react";
import classes from './calendar.module.scss'
import {Select} from "../select/select";


interface IType {
    changeDate: (val: string) => void,
    formatISO?:boolean
}

const monthArr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
export const Calendar: FC<IType> = memo(({changeDate,formatISO}) => {
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedDay, setSelectedDay] = useState('01')
    const [selectedMonth, setSelectedMonth] = useState(`01`)
    const [selectedYear, setSelectedYear] = useState(2024)
    const [countDay, setCountDay] = useState(31)
    const [active, setActive] = useState(false)

    useEffect(() => {
        setCountDay(new Date(selectedYear, +selectedMonth, 0).getDate())
        setSelectedDate(`${selectedDay}.${selectedMonth}.${selectedYear}`)
        if(formatISO){
            changeDate(`${selectedYear}-${selectedMonth}-${selectedDay}`)
        }else{
            changeDate(`${selectedDay}.${selectedMonth}.${selectedYear}`)
        }

    }, [selectedDay, selectedMonth, selectedYear]);

    const handlerYear = (val: any) => {
        setSelectedYear(val)

    }
    const handlerMonth = (val: any) => {
        if (val < 10) {
            setSelectedMonth(`0${+val + 1}`)
        } else {
            setSelectedMonth(val)
        }
    }
    const handlerDay = (day: any) => {
        if (day < 10) {
            setSelectedDay(`0${day}`)
        } else {
            setSelectedDay(`${day}`)
        }
    }
    return (
        <div className={active ? `${classes.calendar} ${classes.active}` : classes.calendar}>
            <div className={classes.overlay} onClick={() => setActive(false)}></div>
            <div className={classes.selectedDate} onClick={() => setActive(true)}>{selectedDate}</div>
            {
                active &&
                <div className={classes.item}>
                    <div className={classes.box}>
                        <Select
                            initValue={1990}
                            dataOption={Array.from({length: 100}, (_, i) => new Date().getFullYear() - i)}
                            onChange={handlerYear}/>
                        <Select
                            dataOption={monthArr}
                            onChange={(e) => handlerMonth(monthArr.indexOf(e))}/>
                    </div>

                    <div className={classes.days}>
                        {
                            Array.from({length: countDay}, (_, i) => i + 1).map(day =>
                                <div
                                    key={day}
                                    className={
                                        day === +selectedDay ?
                                            `${classes.dayItem} ${classes.active}`
                                            : classes.dayItem}
                                    onClick={() => handlerDay(day)}>{day}</div>
                            )
                        }
                    </div>
                </div>
            }

        </div>
    );
}) 
