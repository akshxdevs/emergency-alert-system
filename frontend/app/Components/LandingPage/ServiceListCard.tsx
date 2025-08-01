export const ServiceListCard = () => {
    return <div className="font-martianmono absolute top-[480px] left-1/2 transform -translate-x-1/2 w-full max-w-full">
        <div className="flex flex-col justify-center items-center text-center gap-2">
            <h1 className="text-2xl font-semibold pt-10 pb-5">Services</h1>
            <div className="flex justify-between gap-10 pb-10">
                <div className="flex flex-col gap-10 py-5">
                    <div className="flex justify-center items-center gap-2 border border-red-500 rounded-lg p-3">
                        <img width="30" height="30" src="https://img.icons8.com/material-outlined/24/doctors-bag.png" alt="doctors-bag"/>                        
                        <h1 className="text-sm">Receive alerts about accidents, injuries, and health-related crises in your</h1>
                    </div>
                    <div className="flex justify-center items-center gap-2 border border-red-500 rounded-lg p-3">
                        <img width="30" height="30" src="https://img.icons8.com/ios/50/policeman-male.png" alt="policeman-male"/>                       
                        <h1 className="text-sm">Stay informed about law enforcement activity and public safety concerns.</h1>
                    </div>
                    <div className="flex items-center gap-2 border border-red-500 rounded-lg p-3">
                        <img width="30" height="30" src="https://img.icons8.com/glyph-neue/64/fire-element.png" alt="fire-element"/>
                        <h1 className="text-sm">Get instant notifications about nearby fire hazards and outbreaks.</h1>
                    </div>
                </div>
                <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbwHUpZhMHkZMp2rrx8VScgYlqMkjh3jEEXw&s" alt="" className="h-72 w-96 rounded-lg"/>
                </div>
            </div>
        </div>
    </div>
}