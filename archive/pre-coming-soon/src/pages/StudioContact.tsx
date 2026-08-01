import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { SubBrandLogo } from "../SubBrandLogo";

const SERVICES = [
  "Logo Design",
  "Web/App Design",
  "Web/App Development",
  "Video Editing",
  "Social Media",
];

// Cloudflare rejects real site keys on localhost. Use test keys in dev;
// real keys only in production builds.
const TURNSTILE_SITE_KEY = import.meta.env.DEV
  ? "1x00000000000000000000AA"
  : (import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA");

const API_BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

type FormState = "idle" | "submitting" | "success" | "error";

export default function StudioContact() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const turnstileToken = useRef<string>("");

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !description.trim()) {
      setErrorMessage("Please fill in all required fields.");
      setFormState("error");
      return;
    }

    if (selectedServices.length === 0) {
      setErrorMessage("Please select at least one service.");
      setFormState("error");
      return;
    }

    if (!turnstileToken.current) {
      setErrorMessage("Security check not yet complete — please wait a moment and try again.");
      setFormState("error");
      return;
    }

    setFormState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          services: selectedServices,
          description,
          turnstileToken: turnstileToken.current,
        }),
      });

      if (res.ok) {
        setFormState("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(
          (data as { error?: string }).error ||
            "Something went wrong — please try again or email us directly at victor@theremotelifestyle.com"
        );
        setFormState("error");
      }
    } catch {
      setErrorMessage(
        "Something went wrong — please try again or email us directly at victor@theremotelifestyle.com"
      );
      setFormState("error");
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#1C2B3A] font-sans">
      <div className="max-w-[560px] mx-auto px-6 py-16 md:py-24">

        {/* Back breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#5B8DB8] hover:text-[#1C2B3A] transition-colors font-light mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        {/* Studios logo — centered */}
        <div className="w-full max-w-xs mx-auto mb-10">
          <SubBrandLogo subBrandWord="STUDIOS" uid="contact-studios-logo" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1C2B3A] tracking-tight mb-3">
          Work With Us
        </h1>
        <div className="w-full h-px bg-[#5B8DB8]/20 mb-6" />
        <p className="text-[#1C2B3A]/70 text-base font-light leading-relaxed mb-10">
          If you'd like to work with us, fill out the form below and we'll get
          back to you within 24–48 hours.
        </p>

        {formState === "success" ? (
          <div className="rounded-xl bg-[#EEF3F8] px-6 py-8">
            <p className="text-[#1C2B3A] text-base font-light leading-relaxed">
              Thanks! We'll be in touch within 24–48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm text-[#1C2B3A]/60 font-light">
                Name <span className="text-[#5B8DB8]">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#5B8DB8]/25 bg-[#EEF3F8] px-4 py-3 text-sm text-[#1C2B3A] placeholder-[#1C2B3A]/30 outline-none focus:border-[#5B8DB8]/60 transition-colors"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm text-[#1C2B3A]/60 font-light">
                Email <span className="text-[#5B8DB8]">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#5B8DB8]/25 bg-[#EEF3F8] px-4 py-3 text-sm text-[#1C2B3A] placeholder-[#1C2B3A]/30 outline-none focus:border-[#5B8DB8]/60 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm text-[#1C2B3A]/60 font-light">
                Phone Number <span className="text-[#5B8DB8]">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-[#5B8DB8]/25 bg-[#EEF3F8] px-4 py-3 text-sm text-[#1C2B3A] placeholder-[#1C2B3A]/30 outline-none focus:border-[#5B8DB8]/60 transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Services */}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-[#1C2B3A]/60 font-light">
                Services <span className="text-[#5B8DB8]">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((service) => {
                  const active = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleService(service)}
                      className={`rounded-full px-4 py-1.5 text-sm font-light border transition-colors ${
                        active
                          ? "bg-[#5B8DB8] border-[#5B8DB8] text-white"
                          : "bg-[#EEF3F8] border-[#5B8DB8]/25 text-[#1C2B3A]/70 hover:border-[#5B8DB8]/60"
                      }`}
                    >
                      {service}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm text-[#1C2B3A]/60 font-light">
                Tell us about your project <span className="text-[#5B8DB8]">*</span>
              </label>
              <textarea
                id="description"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-[#5B8DB8]/25 bg-[#EEF3F8] px-4 py-3 text-sm text-[#1C2B3A] placeholder-[#1C2B3A]/30 outline-none focus:border-[#5B8DB8]/60 transition-colors resize-none"
                placeholder="Describe what you're looking for..."
              />
            </div>

            {/* Turnstile */}
            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              options={{ appearance: "execute" }}
              onSuccess={(token) => {
                turnstileToken.current = token;
              }}
            />

            {/* Error message */}
            {formState === "error" && (
              <p className="text-sm text-[#1C2B3A]/70 font-light leading-relaxed border-l-2 border-[#5B8DB8] pl-3">
                {errorMessage ||
                  "Something went wrong — please try again or email us directly at victor@theremotelifestyle.com"}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="w-full rounded-lg bg-[#5B8DB8] text-white text-sm font-light py-3 px-6 tracking-wide hover:bg-[#1C2B3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {formState === "submitting" ? "Sending…" : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
