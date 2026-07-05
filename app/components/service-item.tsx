"use client"

import {Barbershop, BarbershopService, Booking} from '../../prisma/generated/client'
import Image from 'next/image'
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Sheet } from './ui/sheet';
import { useEffect, useMemo, useState } from 'react';
import { set } from 'date-fns';
import { createBooking } from '../_actions/create-booking';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { getBookings } from '../_actions/get-booking';
import { Dialog, DialogContent } from './ui/dialog';
import SignInDialog from './sign-in-dialog';
import { getTimeList } from '../_data/get-time-list';
import BookingSheetContent from './booking-sheet-content';
import { createStripeCheckout } from '../_actions/create-stripe-checkout';

interface ServiceItemProps {
    service: BarbershopService
    barbershop: Pick<Barbershop, 'name'>
}

const ServiceItem = ({service, barbershop} :  ServiceItemProps) => {
    const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
    const {data} = useSession() // Esta função trás dados do usuário logado
    const [dayBookings, setDayBookings] = useState<Booking[]>([])
    const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            if(!selectedDay) return
            // Função retorna os horários disponíveis para todas as barbearias
            // Porém tem que ser de uma barbearia em específico
            // Então tenho que passar para o getBookings além do date e do serviceId o Id da barbearia
            // para ele pegar os horários só daquela barbearia
            const bookings = await getBookings({date: selectedDay, serviceId: service.id})
            setDayBookings(bookings)
        }
        fetch()
    }, [selectedDay, service.id])

    const handleBookingSheetOpenChange = () => {
        setSelectedDay(undefined)
        setSelectedTime(undefined)
        setDayBookings([])
        setBookingSheetIsOpen(false)
    }

    const handleBookingClick = () => {
        if(data?.user){
            return setBookingSheetIsOpen(true)
        }
        return setSignInDialogIsOpen(true)
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDay(date)
    }

    const handleTimeSelect = (time: string | undefined) => {
        setSelectedTime(time)
    }

    const handleCreateBooking = async () => {
        // 1. Não exibir horários que já foram agendados
        // 2. Salvar o agendamento para o usuário logado
        // 3. Não exibir o botão de "Reservar" se o usuário não estiver logado
        try{
            if(!selectedDate){
                return
            }
            console.log(`Dia da reserva: ${selectedDate} - Id do serviço: ${service.id}`)
            // ESTA FUNÇÃO SERÁ ALTERADA!!!
            const booking = await createBooking({
                serviceId: service.id,
                date: selectedDate,
            })

            const { sessionUrl } = await createStripeCheckout({service, bookingId: booking.id})
            window.location.href = sessionUrl

            // COMENTADOS POR ENQUANTO PARA TESTAR O STRIPE
            //handleBookingSheetOpenChange()
            // toast.success("Reserva criada com sucesso!", {
            //     action: {
            //         label: "Ver agendamentos",
            //         onClick: () => router.push("/bookings")
            //     }
            // })
        } catch (error) {
            console.log(error)
            toast.error("Error ao criar reserva!")
        }
    }


    const timeList = useMemo(() => {
        if (!selectedDay) return []
        return getTimeList({ bookings: dayBookings, selectedDay: selectedDay })
    }, [dayBookings, selectedDay])

    const selectedDate = useMemo(() => {
        if(!selectedDay || !selectedTime) return
        return set(selectedDay, {
            hours: Number(selectedTime?.split(":")[0]),
            minutes: Number(selectedTime?.split(":")[1])
        })
    }, [selectedDay, selectedTime])


    return (
        <>
            <Card className="ring-0">
                <CardContent  className='flex items-center gap-3 p-3'>
                    {/*Imagem */}
                    <div className='relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]'>
                        <Image alt={service.name} src={service.imageURL} fill className='object-cover rounded-lg'/>
                    </div>

                    {/*Direita */}
                    <div className='space-y-2'>
                        <h3 className='font-semibold text-sm'>{service.name}</h3>
                        <p className='text-sm text-gray-400'>{service.description}</p>
                        <div className='flex items-center justify-between'>
                            <p className='text-sm font-bold text-primary'>
                                {Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(Number(service.price))}
                            </p>

                            <Sheet open={bookingSheetIsOpen} onOpenChange={handleBookingSheetOpenChange}>
                                
                                <Button 
                                    onClick={handleBookingClick}
                                    variant='secondary' 
                                    size='sm'>Reservar
                                </Button>
                                <BookingSheetContent 
                                    barbershop={barbershop}
                                    handleCreateBooking={handleCreateBooking}
                                    handleDateSelect={handleDateSelect}
                                    handleTimeSelect={handleTimeSelect}
                                    selectedDate={selectedDate}
                                    selectedDay={selectedDay}
                                    selectedTime={selectedTime}
                                    service={service}
                                    timeList={timeList}
                                />
                                
                            </Sheet>
                            
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={signInDialogIsOpen} onOpenChange={(open) => setSignInDialogIsOpen(open)}>
                <DialogContent className='w-[90%]'>
                    <SignInDialog/>
                </DialogContent>
            </Dialog>
        </>
     );
}
 
export default ServiceItem;