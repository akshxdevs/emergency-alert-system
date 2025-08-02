export const AkshxFooter = () => {
    return <div className="font-martianmono absolute top-[1300px] w-full max-w-full">
        <div className="flex flex-col justify-center items-center text-center gap-2">
            <footer className="text-zinc-400 py-5 px-4 sm:px-10 mt-12">
                <div className="max-w-7xl flex flex-col justify-between items-center gap-2">
                    <div className="flex space-x-6 text-sm">
                        <a href="#" className="hover:text-zinc-800 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-zinc-800 transition-colors">Terms of Use</a>
                        <a href="#" className="hover:text-zinc-800 transition-colors">Contact</a>
                    </div>
                    <div className="text-xs text-zinc-500 text-center sm:text-right">
                    © {new Date().getFullYear()} <a href="https://x.com/akshxdevs" className="text-black 0font-medium hover:text-zinc-600 hover:underline">akshxdevs</a>. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    </div>
}