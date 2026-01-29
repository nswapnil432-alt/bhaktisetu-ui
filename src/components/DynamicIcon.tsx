import React from 'react';
// Import ALL icons you want to support
import { 
  Mic, Music, Droplet, Lightbulb, Drum, Piano, Users, Camera, 
  Sparkles, Star, Heart, Activity, Anchor, Bell, BookOpen, 
  Crown, Feather, Flower, Flame, Palette 
} from 'lucide-react';

// 1. Create the Dictionary
const iconMap: Record<string, any> = {
  Mic, Music, Droplet, Lightbulb, Drum, Piano, Users, Camera, 
  Sparkles, Star, Heart, Activity, Anchor, Bell, BookOpen, 
  Crown, Feather, Flower, Flame, Palette
};

interface DynamicIconProps {
  iconName: string; // The string from database: "Mic", "Music"
  color?: string;
  size?: number;
  className?: string;
}

export const DynamicIcon = ({ iconName, color, size = 24, className }: DynamicIconProps) => {
  // 2. Find the Icon Component
  // If the name is wrong or missing, show 'Sparkles' as default
  const IconComponent = iconMap[iconName] || Sparkles;

  return <IconComponent color={color} size={size} className={className} />;
};