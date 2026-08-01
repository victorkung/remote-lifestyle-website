import { TRLLogo } from "./TRLLogo";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-[#1C2B3A] font-sans flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md md:max-w-lg">
        <TRLLogo uid="hero" />
      </div>
      <p className="mt-10 text-[#1C2B3A]/50 text-sm md:text-base font-light tracking-[0.3em] uppercase">
        Coming soon
      </p>
    </div>
  );
}
