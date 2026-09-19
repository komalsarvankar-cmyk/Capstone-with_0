import React from 'react';
import {
  Footprints,
  Sunset,
  Utensils,
  Gamepad2,
  Music,
  Coffee,
  BookOpen,
  Compass,
  Camera,
  Bike,
  Palette,
  Sparkles,
} from 'lucide-react-native';
import { colors } from '@/theme';
import type { Activity } from '@/types';

/** Ported verbatim from the original ChooseActivityScreen's getActivityIcon switch. */
const ICON_MAP: Record<string, { Icon: typeof Sparkles; color: string }> = {
  walk: { Icon: Footprints, color: colors.lavender600 },
  sunset: { Icon: Sunset, color: colors.amber600 },
  utensils: { Icon: Utensils, color: colors.emerald600 },
  gamepad: { Icon: Gamepad2, color: colors.lavender600 },
  music: { Icon: Music, color: colors.pink500 },
  coffee: { Icon: Coffee, color: colors.amber700 },
  book: { Icon: BookOpen, color: colors.indigo600 },
  compass: { Icon: Compass, color: colors.orange500 },
  camera: { Icon: Camera, color: colors.lavender600 },
  bike: { Icon: Bike, color: colors.emerald500 },
  palette: { Icon: Palette, color: colors.pink500 },
};

export function ActivityIcon({ iconName, size = 18 }: { iconName: Activity['iconName']; size?: number }) {
  const entry = ICON_MAP[iconName] ?? { Icon: Sparkles, color: colors.lavender600 };
  const { Icon, color } = entry;
  return <Icon size={size} color={color} />;
}
