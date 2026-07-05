"use server"
import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../_lib/auth'

interface CreateBookingParams {
    serviceId: string,
    date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
    const user = await getServerSession(authOptions)
    if(!user){
        throw new Error("Usuário não autenticado!")
    }
    const service = await db.barbershopService.findUnique({
        where: {
            id: params.serviceId
        }
    })

    if (!service) {
        throw new Error('Serviço não encontrado')
    }

    const booking = await db.booking.create({
        data: {
            ...params,
            userId: user.user.id,
            serviceName: service.name,
            servicePrice: service.price,
        }
    })

    revalidatePath(`/barbershops/${service.barbershopId}`)
    revalidatePath('/bookings')

    return booking
}