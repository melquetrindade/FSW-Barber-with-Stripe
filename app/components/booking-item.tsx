"use client"

import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Prisma } from "@/prisma/generated/client"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Image from "next/image"
import PhoneItem from "./phone-item"
import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { deleteBooking } from "../_actions/delete-booking"
import { toast } from "sonner"
import { useState } from "react"
import BookingSummary from "./booking-summary"

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: {
        include: {
          barbershop: true
        }
      }
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const isConfirmed = isFuture(booking.date)
  const {
    service: { barbershop },
  } = booking
  const bookingStatus = booking.status
  const handleCancelBooking = async () => {
    try {
      await deleteBooking(booking.id)
      setIsAlertDialogOpen(false)
      toast.success("Reserva cancelada com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar reserva. Tente novamente.")
    }
  }

  const handleSheetOpenChange = (isOpen: boolean) => {
    setIsAlertDialogOpen(isOpen)
  }

  // Depois ajustar essa função
  const statusBooking = () => {
    if(isConfirmed && bookingStatus === 'CONFIRMED'){
      return "Confirmado"
    } else if(isConfirmed && bookingStatus === 'CANCELED'){
      return "Cancelado"
    } else if(isConfirmed && bookingStatus === 'PENDING_PAYMENT'){
      return "Pagamento pendente"
    } else if(!isConfirmed && bookingStatus === 'CONFIRMED'){
      return "Finalizado"
    } return "Finalizado"
  }

  return (
    <Sheet open={isAlertDialogOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger className="w-full min-w-[90%]">
        <Card className="min-w-[90%] ring-0">
          <CardContent className="flex justify-between">
            {/*Esquerda */}
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge
                variant={isConfirmed ? "default" : "secondary"}
                className="w-fit rounded-xl"
              >
                {statusBooking()}
              </Badge>
              <h3 className="font-bold">{booking.service.name}</h3>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.service.barbershop.imageURL} />
                </Avatar>
                <p className="text-sm">{booking.service.barbershop.name}</p>
              </div>
            </div>

            {/*Direita */}
            <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl">
                {format(booking.date, "dd", { locale: ptBR })}
              </p>
              <p className="text-sm">
                {format(booking.date, "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="!w-[80%] !max-w-none">
        {" "}
        {/*O "!" server para ele desconsiderar a formatação padrão do shadcn, permitindo colocar a largura que a gente quiser */}
        <SheetHeader>
          <SheetTitle className="text-left">Informções da Reserva</SheetTitle>

          <div className="relative mt-6 flex h-[180px] w-full items-end">
            <Image
              alt={`Mapa da barbearia ${booking.service.barbershop.name}`}
              src="/map.png"
              fill
              className="rounded-xl object-cover"
            />

            <Card className="z-50 mx-5 mb-3 w-full rounded-xl">
              <CardContent className="flex items-center gap-3 px-5 py-3">
                <Avatar>
                  <AvatarImage src={barbershop.imageURL} />
                </Avatar>
                <div>
                  <h3 className="font-bold">{barbershop.name}</h3>
                  <p className="text-xs">{barbershop.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Badge
              variant={isConfirmed ? "default" : "secondary"}
              className="w-fit rounded-xl"
            >
              {isConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>

            <div className="mb-6 mt-3">
              <BookingSummary 
                barbershop={barbershop} 
                service={booking.service} 
                selectedDate={booking.date} />
            </div>
            

            <div className="space-y-3">
              {barbershop.phones.map((phone) => (
                <PhoneItem key={phone} phone={phone} />
              ))}
            </div>
          </div>

          <SheetFooter className="mt-6 pl-0 pr-3">
            <div className="flex w-full items-center gap-3">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className={isConfirmed ? `w-[50%]` : `w-[100%]`}
                >
                  Voltar
                </Button>
              </SheetClose>

              {isConfirmed && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-[50%] bg-destructive text-white">
                      Cancelar reserva
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="w-[100%] ring-1 ring-secondary">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Você quer cancelar a reserva?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Ao cancelar, você perderá sua reserva e não poderá
                        recuperá-la. Essa ação é irreversível.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel variant="outline">
                        Voltar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="text-white"
                        style={{ backgroundColor: "#dc2626" }}
                        onClick={handleCancelBooking}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </SheetFooter>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default BookingItem
