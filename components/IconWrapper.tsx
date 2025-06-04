import React from "react";
import * as LucideIcons from "lucide-react";

interface IconWrapperProps {
  icon: string;
  size?: number;
  className?: string;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ 
  icon, 
  size = 24, 
  className = "" 
}) => {
  // Check if the icon exists in Lucide
  const LucideIcon = LucideIcons[icon as keyof typeof LucideIcons] as React.FC<{ size?: number; className?: string }>;
  
  if (!LucideIcon) {
    // Fallback to a default icon if the specified one doesn't exist
    const FallbackIcon = LucideIcons.HelpCircle;
    return <FallbackIcon size={size} className={className} />;
  }
  
  return <LucideIcon size={size} className={className} />;
};

export default IconWrapper; 