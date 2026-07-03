import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from 'lucide-react'
import { db } from '../../_lib/prisma'
import Image from 'next/image'
import { Button } from "../../components/ui/button"
import Link from "next/link"
import { notFound } from 'next/navigation'
import ServiceItem from '@/app/components/service-item'
import PhoneItem from '@/app/components/phone-item'
import SidebarSheet from "../../components/siderbar-sheet"
import { Sheet, SheetTrigger } from "../../components/ui/sheet"

interface BarbershopPageProps{
    params: {
        id: string
    }
}

const BarbershopPage = async ({params} : BarbershopPageProps) => {
    // Chamar o BD e encontrar a barbearia com o ID
    const barbershop = await db.barbershop.findUnique({
        where: {
            id: params.id
        },
        include: {
            services: true
        }
    })

    if(!barbershop){
        return notFound()
    }

    return (  
        <div>
            {/*Imagem */}
            <div className='relative h-[250px] w-full'>
                <Image alt={barbershop!.name} src={barbershop!.imageURL} fill className='object-cover' />

                <Button 
                    className='absolute left-4 top-4'
                    variant='secondary'
                    size='icon'
                    asChild
                >
                    <Link href='/'>
                        <ChevronLeftIcon/>
                    </Link>
                </Button>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button className='absolute top-4 right-4' size='icon' variant='outline'>
                            <MenuIcon/>
                        </Button>
                    </SheetTrigger>
                    <SidebarSheet/>
                </Sheet>
            </div>

            {/*Texto */}
            <div className='border-b border-solid p-5'>
                <h1 className='mb-3 text-xl font-bold'>{barbershop?.name}</h1>
                <div className='mb-2 flex items-center gap-2'>
                    <MapPinIcon className='text-primary' size={18}/>
                    <p className='text-sm'>{barbershop?.address}</p> 
                </div>

                <div className='flex items-center gap-2'>
                    <StarIcon className='fill-primary text-primary' size={18}/>
                    <p className='text-sm'>5,0 (499 avaliações)</p> 
                </div>
            </div>

            {/*Descrição */}
            <div className='p-5 space-y-3 border-b border-solid'>
                <h2 className='text-xs font-bold uppercase text-gray-400'>Sobre nós</h2>
                <p className='text-sm text-justify'>{barbershop?.description}</p>
            </div>

            {/*Serviços */}
            <div className='p-5 border-b border-solid'>
                <h2 className='text-xs font-bold uppercase text-gray-400 mb-3'>Serviços</h2>
                <div className='space-y-3'>
                    {barbershop.services.map((service) => (
                        <ServiceItem key={service.id} barbershop={JSON.parse(JSON.stringify(barbershop))} service={JSON.parse(JSON.stringify(service))}/>
                    ))}
                </div>
            </div>

            {/*Contato */}
            <div className='p-5 space-y-3'>
                {barbershop.phones.map((phone) => (
                    <PhoneItem key={phone} phone={phone}/>
                ))}
            </div>
        </div>
    );
}
 
export default BarbershopPage;