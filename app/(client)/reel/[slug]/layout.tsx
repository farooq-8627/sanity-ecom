import { ReactNode } from "react";

export default function ReelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-[100dvh] overflow-hidden">
      {children}
    </div>
  );
} 