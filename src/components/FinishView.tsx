"use client";

export default function FinishView({ onStartFresh }: { onStartFresh: () => void }) {
    return (
        <div className="bg-background h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 antialiased selection:bg-primary selection:text-white relative p-6">
            {/* Background Glow - More prominent on desktop */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-40"></div>
            </div>

            {/* Main Content Group */}
            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto z-10 relative gap-12">
                {/* Content Block */}
                <div className="flex flex-col items-center shrink-0">
                    {/* Success Icon */}
                    <div className="mb-8 sm:mb-10 flex items-center justify-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 backdrop-blur-md animate-fade-in-up border border-primary/20 shadow-2xl">
                            <span className="material-icons-round text-primary text-4xl sm:text-5xl drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">check</span>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="text-center space-y-4 animate-fade-in-up delay-100">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                            Session complete.
                        </h1>
                        <p className="text-lg sm:text-xl text-foreground/60 font-medium tracking-wide">
                            Well done.
                        </p>
                    </div>
                </div>

                {/* Footer Button - Grouped close */}
                <div className="w-full animate-fade-in-up delay-200 shrink-0">
                    <button
                        onClick={onStartFresh}
                        className="group w-full h-14 sm:h-16 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/20 border border-white/10"
                    >
                        <span className="text-white font-bold text-lg sm:text-xl mr-3">Start fresh</span>
                        <span className="material-icons-round text-white group-hover:translate-x-1 transition-transform duration-200 text-2xl">
                            arrow_forward
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
