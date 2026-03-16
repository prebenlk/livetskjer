import { Moon, Heart, Brain, Users, Smile, Shield, Flame, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  moon: Moon,
  heart: Heart,
  brain: Brain,
  users: Users,
  smile: Smile,
  shield: Shield,
  flame: Flame,
  wind: Wind,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Heart;
}
