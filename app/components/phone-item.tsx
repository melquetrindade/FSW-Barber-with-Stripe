'use client'

import { toast } from "sonner"
import { Button } from "./ui/button"
import { SmartphoneIcon } from 'lucide-react'

interface PhoneItemProps {
    phone: string
}

const PhoneItem = ({phone} : PhoneItemProps) => {
    const handleCopyPhoneClick = (phone: string) => {
        navigator.clipboard.writeText(phone)
        toast.success("Telefone copiado com sucesso!")
    }

    return (
        <div className='flex justify-between' key={phone}>
            <div className='flex items-center gap-2'>
                <SmartphoneIcon/>
                <p className='text-sm'>{phone}</p>
            </div>
            <Button onClick={() => handleCopyPhoneClick(phone)} variant='outline' size='sm'>Copiar</Button>
        </div>
    );
}
 
export default PhoneItem;