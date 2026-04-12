import { Info, AlertTriangle, Lightbulb } from "lucide-react";
import { ReactNode } from "react";

interface CalloutProps {
  type: "info" | "warning" | "tip";
  title?: string;
  children: ReactNode;
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
};

const styles = {
  info: "bg-callout-info-bg border-callout-info-border text-callout-info-fg",
  warning: "bg-callout-warning-bg border-callout-warning-border text-callout-warning-fg",
  tip: "bg-callout-tip-bg border-callout-tip-border text-callout-tip-fg",
};

export function Callout({ type, title, children }: CalloutProps) {
  const Icon = icons[type];

  return (
    <div className={`flex gap-3 p-4 rounded-lg border-l-4 mb-4 ${styles[type]}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>
        {title && <div className="font-semibold text-sm mb-1">{title}</div>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
