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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-5">{description}</p>
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
