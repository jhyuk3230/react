import axios from 'axios';
import { useEffect, useState } from 'react';
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, setDate, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import styles from '@/styles/calendar.module.css';

interface HolidayType {
    date: string;
}

export default function Calendar() {
    const [holidays, setHolidays] = useState <HolidayType[]>([]);
    const [holidayYear, setHolidayYear] = useState(new Date().getFullYear())

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${holidayYear}/KR`);

                console.log(response);
                console.log(response.data);
                setHolidays(response.data);
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
                    return (
                        <li key={`${day}d`} className={`${day.getDay() === 0 ? styles.sun : ''} ${day.getDay() === 6 ? styles.sat : ''} ${today.getDate() === day.getDate() && today.getMonth() === day.getMonth() && today.getFullYear() === day.getFullYear() ? styles.today : ''} ${isHoliday ? styles.holiday : ''}`}>{day.getMonth() + 1} / {day.getDate()}</li>
                    )
                })}
            </ul>
        </>
    )
}