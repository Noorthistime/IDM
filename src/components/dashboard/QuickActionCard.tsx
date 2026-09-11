import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface QuickActionCardProps {
  icon: ReactNode;
  iconBg: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaBg: string;
  href: string;
}

export default function QuickActionCard({
  icon,
  iconBg,
  title,
  description,
  ctaLabel,
  ctaBg,
  href,
}: QuickActionCardProps) {
  return (
    <div className="glass-panel metallic-border p-6 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all duration-300 relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-5">{description}</p>
      <Link
        href={href}
        className={`inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 ${ctaBg}`}
      >
        {ctaLabel}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
