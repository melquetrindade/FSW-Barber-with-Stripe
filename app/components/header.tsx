import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Sheet, SheetTrigger } from "./ui/sheet"
import { MenuIcon } from "lucide-react"
import { Button } from "./ui/button"
import SidebarSheet from "./siderbar-sheet"
import Link from "next/link"


const Header = () => {
    return (
        <Card className="rounded-none ring-0">
            <CardContent className="p-5 flex flex-row items-center justify-between">
                <Link href="/">
                    <Image alt='FSW Barber' src="/logo.png" height={18} width={120} />
                </Link>
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size='icon' variant='outline'>
                            <MenuIcon/>
                        </Button>
                    </SheetTrigger>
                    <SidebarSheet/>
                </Sheet>
            </CardContent>
        </Card>
    )
}

export default Header