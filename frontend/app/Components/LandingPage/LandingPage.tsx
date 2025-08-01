import { AkshxFooter } from "../AkshxFooter"
import { AppBar } from "../AppBar"
import { HeaderCard } from "./HeaderCard"
import { ServiceDetailsCard } from "./ServiceDetailsCard"
import { ServiceListCard } from "./ServiceListCard"

export const LandingPage = () => {
    return <div>
        <AppBar/>
        <HeaderCard/>
        <ServiceListCard/>
        <ServiceDetailsCard/>
        <AkshxFooter/>
    </div>
}