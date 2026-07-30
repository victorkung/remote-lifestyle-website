import { Routes, Route, Link } from "react-router-dom";
import { FaInstagram, FaYoutube, FaXTwitter, FaTiktok } from "react-icons/fa6";
import { TRLLogo } from "./TRLLogo";
import { SubBrandLogo } from "./SubBrandLogo";
import StudioContact from "./pages/StudioContact";

const SOCIAL_LINKS = [
  { Icon: FaInstagram, href: "https://www.instagram.com/remotelifestyle/", label: "Instagram" },
  { Icon: FaYoutube,  href: "https://www.youtube.com/c/theremotelifestyle", label: "YouTube" },
  { Icon: FaTiktok,  href: "https://www.tiktok.com/@theremotelifestyle", label: "TikTok" },
  { Icon: FaXTwitter, href: "https://x.com/remotelifestyle", label: "X" },
];

function SocialRow({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const gap = size === "sm" ? "gap-5" : "gap-6";
  return (
    <div className="flex flex-col items-center gap-3">
      {size === "md" && (
        <p className="text-xs text-[#1C2B3A]/40 font-light tracking-widest uppercase">
          Follow Us
        </p>
      )}
      <div className={`flex items-center justify-center ${gap}`}>
        {SOCIAL_LINKS.map(({ Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-[#5B8DB8] hover:text-[#1C2B3A] transition-colors"
          >
            <Icon className={dim} />
          </a>
        ))}
      </div>
    </div>
  );
}

function PillarSection({
  logo,
  description,
  children,
  background = "white",
}: {
  logo: React.ReactNode;
  description: string;
  children: React.ReactNode;
  background?: "white" | "tint";
}) {
  const bg = background === "tint" ? "bg-[#EEF3F8]" : "bg-white";
  return (
    <section className={`${bg} py-24 md:py-32 px-6`}>
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        <div className="w-full max-w-sm md:max-w-md mb-8">
          {logo}
        </div>
        <p className="text-[#1C2B3A]/70 text-base md:text-lg font-light leading-relaxed max-w-xl mb-10">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}

function ProductCard({
  icon,
  name,
  description,
  url,
  badge,
}: {
  icon: string;
  name: string;
  description: string;
  url: string;
  badge?: string;
}) {
  const domain = url.replace(/^https?:\/\//, "");
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 w-full max-w-md bg-white border border-[#5B8DB8]/15 hover:border-[#5B8DB8]/45 rounded-xl px-5 py-4 transition-colors text-left"
    >
      <img
        src={icon}
        alt={`${name} icon`}
        className="w-14 h-14 rounded-xl flex-shrink-0 object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <h3 className="text-base font-semibold text-[#1C2B3A] tracking-tight leading-snug">
            {name}
          </h3>
          {badge && (
            <span className="text-[10px] text-[#5B8DB8] tracking-widest uppercase flex-shrink-0">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-[#1C2B3A]/55 font-light leading-relaxed">
          {description}
        </p>
        <span className="block mt-2 text-xs text-[#5B8DB8] group-hover:text-[#1C2B3A] transition-colors tracking-wide">
          {domain} →
        </span>
      </div>
    </a>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1C2B3A] font-sans">
      {/* Hero — logo only, no nav */}
      <header className="pt-20 md:pt-28 pb-10 md:pb-14 px-6">
        <div className="max-w-2xl mx-auto">
          <TRLLogo uid="hero" />
        </div>
      </header>

      {/* Intro line */}
      <div className="pb-20 md:pb-24 px-6">
        <p className="max-w-xl mx-auto text-center text-[#1C2B3A]/60 text-base md:text-lg font-light tracking-wide">
          The Remote Lifestyle is a lifestyle brand created by a husband-and-wife team living and working remotely — comprised of three parts.
        </p>
      </div>

      {/* Pillar 1: The Remote Lifestyle (content) */}
      <PillarSection
        logo={<TRLLogo uid="pillar-trl" />}
        description="The story side. Where we share what we're learning, where we're going, and how we're building a life that works from anywhere."
        background="tint"
      >
        <SocialRow />
      </PillarSection>

      {/* Pillar 2: The Remote Lifestyle Ventures (apps) */}
      <PillarSection
        logo={<SubBrandLogo subBrandWord="VENTURES" uid="pillar-ventures" />}
        description="The product side. Where we build digital products and apps that solve everyday problems."
        background="white"
      >
        <ProductCard
          icon="/podbrief-icon.png"
          name="PodBrief"
          description="Turn any podcast or YouTube video into a text and audio summary."
          url="https://podbrief.io"
          badge="Live"
        />
      </PillarSection>

      {/* Pillar 3: The Remote Lifestyle Studios (agency) */}
      <PillarSection
        logo={<SubBrandLogo subBrandWord="STUDIOS" uid="pillar-studios" />}
        description="The client side. Where we provide branding, app design + development, video and social content for select clients."
        background="tint"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-[#5B8DB8] tracking-widest uppercase font-light">
            Portfolio coming soon
          </p>
          <Link
            to="/studios/contact"
            className="text-sm text-[#5B8DB8] hover:text-[#1C2B3A] transition-colors font-light"
          >
            Want to work with us? Get in touch →
          </Link>
        </div>
      </PillarSection>

      {/* Footer */}
      <footer className="border-t border-[#5B8DB8]/20 py-12 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <SocialRow size="sm" />
          <p className="text-xs text-[#1C2B3A]/40 font-light tracking-wide">
            © 2026 The Remote Lifestyle
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/studios/contact" element={<StudioContact />} />
    </Routes>
  );
}
