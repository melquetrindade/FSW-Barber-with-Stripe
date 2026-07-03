import { StarIcon } from "lucide-react"
import type { Barbershop } from "../../prisma/generated/client"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from 'next/image'
import {Badge} from "./ui/badge"
import Link from "next/link"

const BarberShopItem = ({ barbershop }: { barbershop: Barbershop }) => {
    //console.log(barbershop.id)
    return (
        <Card className="min-w-[167px] rounded-2xl ring-0">
            <CardContent className="p-0 px-1 pt-1">
                {/*Imagem */}
                <div className="relative h-[159px] w-full">
                    <Image 
                        alt={barbershop.name} 
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Eu que adicionei este sizes (Fora a parte) 
                        className="object-cover rounded-2xl" 
                        src={barbershop.imageURL} />

                    <Badge className=" space-x-1 absolute rounded-md left-2 top-2" variant="secondary">
                        <StarIcon className="fill-primary text-primary" size={12}/>
                        <p className="text-xs font-semibold">5,0</p>
                    </Badge>
                </div>

                {/*Texto */}
                <div className="py-3 px-1">
                    <h3 className="truncate font-semibold">{barbershop.name}</h3>
                    <p className="truncate text-sm text-gray-400">{barbershop.address}</p>
                    <Button variant='secondary' className="mt-3 w-full" asChild>
                        <Link href={`/barbershops/${barbershop.id}`}>Reservar</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default BarberShopItem