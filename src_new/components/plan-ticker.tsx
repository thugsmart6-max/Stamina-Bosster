import { AppIcon } from "@/components/app-icon";
import type { IconName } from "@/lib/icons";
import { Marquee } from "./marquee";

const PLANS: { name: string; pct: number; color: string; icon: IconName }[] = [
  { name: "Brisk Walking", pct: 72, color: "bg-yellow", icon: "planWalk" },
  { name: "Pelvic Floor", pct: 45, color: "bg-pink", icon: "planCore" },
  { name: "Lean Protein", pct: 88, color: "bg-lime", icon: "planFood" },
  { name: "Sleep Protocol", pct: 60, color: "bg-primary", icon: "planSleep" },
  { name: "Core Planks", pct: 55, color: "bg-accent", icon: "goalFitness" },
  { name: "Hydration", pct: 90, color: "bg-yellow", icon: "planHydration" },
  { name: "Stress Reset", pct: 38, color: "bg-pink", icon: "intakeLifestyle" },
  { name: "Cardio Bike", pct: 64, color: "bg-red", icon: "exercise" },
];

function PlanCard({
  name,
  pct,
  color,
  icon,
}: {
  name: string;
  pct: number;
  color: string;
  icon: IconName;
}) {
  return (
    <div className="flex w-56 shrink-0 flex-col gap-2 rounded-xl border border-white/10 bg-surface-elevated p-4">
      <div className="flex items-center gap-2">
        <AppIcon name={icon} size={20} className="text-primary" />
        <p className="text-sm font-bold text-white">{name}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="flex items-center gap-1 text-xs text-muted">
        <AppIcon name="check" size={12} className="text-primary" />
        {pct}% matched
      </p>
    </div>
  );
}

export function PlanTicker() {
  const cards = PLANS.map((p) => <PlanCard key={p.name} {...p} />);

  return (
    <div className="border-y border-white/10 bg-background py-6">
      <Marquee>{cards}</Marquee>
    </div>
  );
}
