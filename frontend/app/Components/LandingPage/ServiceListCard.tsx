export const ServiceListCard = () => {
    return (
        <div className="font-martianmono absolute top-[480px] left-1/2 transform -translate-x-1/2 w-full max-w-full">
            <div className="flex flex-col justify-center items-center text-center gap-2 text-zinc-950">
                <h1 className="text-2xl font-semibold pt-10 pb-5">Services</h1>
                <div className="flex justify-between gap-10 pb-10">
                    <div className="flex flex-col gap-10 ">
                        {[
                            {
                                icon: "https://img.icons8.com/material-outlined/24/doctors-bag.png",
                                text: "Receive alerts about accidents, injuries, and health-related crises in your area."
                            },
                            {
                                icon: "https://img.icons8.com/ios/50/policeman-male.png",
                                text: "Stay informed about law enforcement activity and public safety concerns."
                            },
                            {
                                icon: "https://img.icons8.com/glyph-neue/64/fire-element.png",
                                text: "Get instant notifications about nearby fire hazards and outbreaks."
                            }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-start items-center gap-3 border border-red-500 rounded-lg px-4 w-[700px] h-[70px] bg-white"
                            >
                                <img width="30" height="30" src={item.icon} alt="icon" />
                                <h1 className="text-xs text-left leading-snug">
                                    {item.text}
                                </h1>
                            </div>
                        ))}
                    </div>
                    <div>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbwHUpZhMHkZMp2rrx8VScgYlqMkjh3jEEXw&s"
                            alt="service"
                            className="h-[300px] w-[400px] object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
