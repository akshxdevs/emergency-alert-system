export const ServiceDetailsCard = () => {
    return (
        <div className="font-martianmono absolute top-[900px] left-1/2 transform -translate-x-1/2 w-full max-w-full">
            <div className="flex flex-col justify-center items-center text-center gap-2 text-zinc-950">
                <h1 className="text-2xl font-semibold pt-10 pb-5">
                    Why Fire, Medical, and Police Alerts in One System?
                </h1>
                <div className="w-[1200px] flex justify-between items-center gap-2 pb-10">
                    {[
                        {
                            img: "https://img.icons8.com/ios-filled/50/fire-alarm-button.png",
                            title: "Fire Alerts",
                            desc: "Fires escalate in seconds. Our system provides instant fire alerts sourced from trusted authorities and user reports, helping you act before it becomes uncontrollable. Integrated with live maps and evacuation guides for quick action."
                        },
                        {
                            img: "https://img.icons8.com/dotty/80/tonometer.png",
                            title: "Medical Alerts",
                            desc: "Whether it’s an accident, cardiac arrest, or health crisis, immediate response is critical. Our alerts connect you with nearby hospitals, emergency contacts, and ambulance services, ensuring you're never alone in a crisis."
                        },
                        {
                            img: "https://img.icons8.com/external-line-icons-vinzence-studio/64/external-criminal-erotic-stuff-line-icons-vinzence-studio.png",
                            title: "Police Alerts",
                            desc: "From theft to civil unrest, being informed about nearby police activity helps you avoid danger. Our system filters verified alerts from law enforcement, enabling civilians to stay safe without spreading panic."
                        },
                        {
                            img: "https://img.icons8.com/pulsar-line/50/--bloodbag.png",
                            title: "Blood Donation",
                            desc: "Connecting donors with patients in critical need, our upcoming blood donation alert system will make it easier to save lives through timely and location-based notifications. Coming Soon! Stay tuned as we prepare to launch this life-saving feature."
                        }
                    ].map((card, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-start items-center p-5 rounded-lg bg-red-50 w-[280px] h-[300px] text-left overflow-hidden"
                        >
                            <img
                                width="50"
                                height="50"
                                src={card.img}
                                alt={card.title}
                                className="object-cover rounded-full mb-2"
                            />
                            <h1 className="text-md font-semibold mb-1 text-center">
                                {card.title}
                            </h1>
                            <p className="text-xs text-center line-clamp-[7]">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
