export const ServiceDetailsCard = () => {
    return <div className="font-gilroyLight absolute top-[900px] left-1/2 transform -translate-x-1/2 w-full max-w-full">
        <div className="flex flex-col justify-center items-center text-center gap-2">
            <h1 className="text-2xl font-semibold pt-10 pb-5">Why Fire, Medical, and Police Alerts in One System?</h1>
            <div className="flex justify-between items-center gap-2 px-20 pb-10">
                <div className="flex flex-col justify-center items-center p-5 rounded-lg bg-red-50">
                    <img src="" alt="" className="h-20 w-20 bg-white/40 rounded-full"/>
                    <h1 className="text-lg font-semibold">Fire Alerts</h1>
                    <p className="text-sm">Fires escalate in seconds. Our system provides instant fire alerts sourced from trusted authorities and user reports, helping you act before it becomes uncontrollable. Integrated with live maps and evacuation guides for quick action.</p>
                </div>
                <div className="flex flex-col justify-center items-center p-5 rounded-lg bg-red-50">
                    <img src="" alt="" className="h-20 w-20 bg-white/40 rounded-full"/>
                    <h1 className="text-lg font-semibold">Medical Alerts</h1>
                    <p className="text-sm">Whether it’s an accident, cardiac arrest, or health crisis, immediate response is critical. Our alerts connect you with nearby hospitals, emergency contacts, and ambulance services, ensuring you're never alone in a crisis.</p>
                </div>
                <div className="flex flex-col justify-center items-center p-5 rounded-lg bg-red-50">
                    <img src="" alt="" className="h-20 w-20 bg-white/40 rounded-full"/>
                    <h1 className="text-lg font-semibold">Police Alerts</h1>
                    <p className="text-sm">From theft to civil unrest, being informed about nearby police activity helps you avoid danger. Our system filters verified alerts from law enforcement, enabling civilians to stay safe without spreading panic.</p>
                </div>
                <div className="flex flex-col justify-center items-center p-5 rounded-lg bg-red-50">
                    <img src="" alt="" className="h-20 w-20 bg-white/40 rounded-full"/>
                    <h1 className="text-lg font-semibold">Blood Donatation</h1>
                    <p className="text-sm">Connecting donors with patients in critical need, our upcoming blood donation alert system will make it easier to save lives through timely and location-based notifications.Coming Soon! Stay tuned as we prepare to launch this life-saving feature.</p>
                </div>
            </div>
        </div>
    </div>
}