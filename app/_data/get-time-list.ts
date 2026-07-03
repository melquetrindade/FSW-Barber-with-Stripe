import { Booking } from "@/prisma/generated/client";
import { TIME_LIST } from "../_constants/time-list"
import { isPast, isToday, set } from 'date-fns';

interface GetTimeListProps {
    bookings: Booking[]
    selectedDay: Date
}


export const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
    // TODO: Não exibir horários no passado
    const timeList = TIME_LIST.filter(time => {
        const hour = Number(time.split(":")[0])
        const minutes = Number(time.split(":")[1])

        // Essa constante verifica se a hora e os minutos estão no passado
        const timeIsOnThePast = isPast(set(new Date(), {hours: hour, minutes: minutes}))
        if(timeIsOnThePast && isToday(selectedDay)){
            return false
        }

        // verifica sem tem reserva no horário atual
        if(bookings.some(booking => booking.date.getHours() === hour && booking.date.getMinutes() === minutes)){
            return false
        }
        return true
    })
    return timeList
}