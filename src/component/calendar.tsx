import axios from 'axios';
import { useEffect, useState } from 'react';
import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import styles from '@/styles/calendar.module.css';

interface HolidayType {
    date: string;
    localName: string;
}

export default function Calendar() {
    const [holidays, setHolidays] = useState <HolidayType[]>([]);
    const [holidayYear, setHolidayYear] = useState(new Date().getFullYear())

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                // const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/2027/KR`);
                const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${holidayYear}/KR`);

                // console.log(response.data)

                const holidayArr = response.data.reduce((arr:any[], data: any) => {
                    const currentDate = new Date(data.date);

                    if (currentDate.getDay() === 0) {
                        let nextDay = addDays(currentDate, 1);
                        let nextDayFormatChange = format(nextDay, 'yyyy-MM-dd');
                        // console.log(nextDayFormatChange);

                        while (response.data.find((item: any) => item.date === nextDayFormatChange)) {
                            nextDay = addDays(nextDay, 1);
                            nextDayFormatChange = format(nextDay, 'yyyy-MM-dd');
                            console.log(nextDayFormatChange);
                        }
                        // currentDate.setDate(currentDate.getDate() + 1)

                        // const formatChange = format(currentDate, 'yyyy-MM-dd');

                        arr.push({
                            date: nextDayFormatChange,
                            localName: '대체공휴일',
                            name: 'alternative holiday'
                        })
                    }

                    arr.push(data);
                    return arr
                }, [])


                // console.log(holidayArr);

                // console.log(response);
                // console.log(response.data);
                setHolidays(holidayArr);
                // setHolidays(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchHolidays();

    }, [holidayYear]);

    const [currentdate, setCurrentDate] = useState(new Date())

    const date = currentdate;
    const today = new Date();
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // console.log(holidays);
    // console.log(calendarDays);


    const prevMonth = () => {
        setCurrentDate(subMonths(date, 1));
        if (subMonths(date, 1).getFullYear() !== holidayYear) {
            setHolidayYear(subMonths(date, 1).getFullYear());
        }
        
    }
    const nextMonth = () => {
        setCurrentDate(addMonths(date, 1));
        if (addMonths(date, 1).getFullYear() !== holidayYear) {
            setHolidayYear(addMonths(date, 1).getFullYear());
        }
    }

    const moveToday = () => {
        setCurrentDate(today);
    }

    return (
        <>
            <h2 className="sr-only">캘린더</h2>
            <div className={styles.calendarHeader}>
                <div className={styles.calendarHeaderInfo}>
                    <button className={styles.calendarHeaderBtn} onClick={prevMonth}>이전 달</button>
                    <h3>{date.getFullYear()} {date.getMonth() + 1}</h3>
                    <button className={styles.calendarHeaderBtn} onClick={nextMonth}>다음 달</button>
                </div>
                <button className={styles.calendarHeaderBtn} onClick={moveToday}>오늘</button>
            </div>
            <ul className={styles.calendar}>
                {calendarDays.map((day) => {
                    const formatChange = format(day, 'yyyy-MM-dd');
                    const isHoliday = holidays.find(holiday => holiday.date === formatChange);
                    // console.log(isHoliday)
                    return (
                        // <li key={`${day}d`} className={`${day.getDay() === 0 ? styles.sun : ''} ${day.getDay() === 6 ? styles.sat : ''} ${today.getDate() === day.getDate() && today.getMonth() === day.getMonth() && today.getFullYear() === day.getFullYear() ? styles.today : ''} ${isHoliday ? styles.holiday : ''}`}>{day.getMonth() + 1} / {day.getDate()}</li>
                        <li key={`${day}d`} className={`${styles.calendarDay}
                            ${day.getDay() === 0 ? styles.sun : ''}
                            ${day.getDay() === 6 ? styles.sat : ''}
                            ${today.getDate() === day.getDate() && today.getMonth() === day.getMonth() && today.getFullYear() === day.getFullYear() ? styles.today : ''} ${isHoliday ? styles.holiday : ''}
                            `}>
                                {day.getDate()} <br />
                                {isHoliday?.localName}
                            </li>
                    )
                })}
            </ul>
        </>
    )
}