"use client";

export default function InterstitialView({ onContinue }: { onContinue: () => void }) {
    return (
        <div className="bg-background text-foreground font-heading antialiased h-screen w-full overflow-hidden select-none flex items-center justify-center relative">
            {/* Background decorative element */}
            <div className="absolute inset-0 z-0 bg-gradient-mesh pointer-events-none w-full h-full opacity-60"></div>

            {/* Main Container - Centered Group */}
            <div className="relative z-10 flex flex-col w-full max-w-md mx-auto px-6 justify-center min-h-screen py-12 gap-12">

                {/* Central Content */}
                <div className="flex flex-col justify-center items-center text-center px-4 shrink-0">
                    {/* Success Icon */}
                    <div className="mb-6 sm:mb-8 flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/10 flex items-center justify-center ring-1 ring-accent/20 backdrop-blur-md shadow-[0_0_30px_rgba(38,217,166,0.2)] animate-fade-in-up">
                            <span className="material-icons-round text-accent text-4xl sm:text-5xl drop-shadow-[0_0_10px_rgba(38,217,166,0.4)]">check</span>
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="font-heading text-accent text-3xl sm:text-4xl font-extrabold leading-tight mb-3 tracking-tight drop-shadow-sm animate-fade-in-up delay-100">
                        Good. One step done.
                    </h1>
                </div>

                {/* Bottom Action - Grouped */}
                <div className="w-full animate-fade-in-up delay-200 shrink-0">
                    <button
                        onClick={onContinue}
                        className="group w-full h-14 sm:h-16 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 hover:shadow-primary/40 border border-white/10"
                    >
                        <span className="text-white font-bold text-lg sm:text-xl mr-3">What now?</span>
                        <span className="material-icons-round text-white group-hover:translate-x-1 transition-transform duration-200 text-2xl">
                            arrow_forward
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
