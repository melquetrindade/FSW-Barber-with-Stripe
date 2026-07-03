import { ptBR } from "date-fns/locale";
import { Calendar } from "./ui/calendar";
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import BookingSummary from "./booking-summary";
import { Barbershop, BarbershopService } from "@/prisma/generated/client";

interface BookingSheetContentProps {
    selectedDay: Date | undefined;
    selectedTime: string | undefined;
    selectedDate: Date | undefined;
    timeList: string[];
    service: BarbershopService;
    barbershop: Pick<Barbershop, 'name'>;
    handleDateSelect: (date: Date | undefined) => void;
    handleTimeSelect: (time: string) => void;
    handleCreateBooking: () => void;
}

const BookingSheetContent = (
    { 
        selectedDay, selectedTime, selectedDate, timeList, service, barbershop, handleDateSelect, handleTimeSelect, handleCreateBooking 
    }: BookingSheetContentProps) => {

    return (
        <SheetContent className='px-0 flex h-full flex-col'>
            <SheetHeader>
                <SheetTitle className="text-center font-bold text-lg">Fazer Reserva</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <div className='px-5 pb-4'>
                    <Calendar
                        mode="single"
                        selected={selectedDay}
                        onSelect={handleDateSelect}
                        locale={ptBR}
                        disabled={{before: new Date()}}
                        className='rounded-2xl'
                        classNames={{
                            weekday: "flex-1 capitalize",
                            day: "flex-1",
                            month_caption: "flex justify-center items-center text-center capitalize",
                            button_previous: "h-8 w-8",
                            button_next: "h-8 w-8",
                        }}
                        />
                </div>
                
                {selectedDay && (
                    <div className='py-4 border border-solid px-5 flex overflow-x-auto [&::-webkit-scrollbar]:hidden gap-2'>
                        {timeList.length > 0 ? timeList.map((time) => (
                            <Button 
                                key={time}
                                variant={selectedTime === time ? 'default' : 'outline'}
                                className='rounded-full'
                                onClick={() => handleTimeSelect(time)}
                            >{time}</Button>
                        )) : 
                            <p className='text-xs'>Não há horários disponíveis para este dia.</p>
                        }
                    </div>
                )}
                
                {selectedDate && (
                    <div className='p-5'>
                        <BookingSummary 
                            service={service} 
                            barbershop={barbershop} 
                            selectedDate={selectedDate} />
                    </div>
                )}

            </div>
            <SheetFooter className='px-5'>
                <Button disabled={!selectedDay || !selectedTime} onClick={handleCreateBooking}>Confirmar</Button>
            </SheetFooter>
        </SheetContent>
    );
}
 
export default BookingSheetContent;