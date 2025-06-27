import {useEffect, useState} from "react";

export const useWorkTime = (worktimeStr?: string): boolean => {
    const [workTime, setWorkTime] = useState(true);

    useEffect(() => {
        if (!worktimeStr) return;

        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const today = days[new Date().getDay()];
        let timeMatch = '';

        if (['Пн', 'Вт', 'Ср', 'Чт', 'Пт'].includes(today)) {
            const match = worktimeStr.match(/Пн-Пт\s*с\s*(\d{1,2}):\d{2}\s*-\s*(\d{1,2}):\d{2}/);
            if (match) timeMatch = match[0];
        } else if (['Сб', 'Вс'].includes(today)) {
            const match = worktimeStr.match(/Сб-Вс\s*с\s*(\d{1,2}):\d{2}\s*-\s*(\d{1,2}):\d{2}/);
            if (match) timeMatch = match[0];
        }

        const match = timeMatch.match(/с\s*(\d{1,2}):\d{2}\s*-\s*(\d{1,2}):\d{2}/);
        if (match) {
            const startHour = Number(match[1]);
            const endHour = Number(match[2]) === 24 ? 0 : Number(match[2]);
            const currentHour = new Date().getHours();

            const isWorking = startHour < endHour
                ? currentHour >= startHour && currentHour < endHour
                : currentHour >= startHour || currentHour < endHour;

            setWorkTime(isWorking);
        } else {
            console.warn("Не удалось распарсить часы из строки:", worktimeStr);
            setWorkTime(true);
        }
    }, [worktimeStr]);

    return workTime;
};
