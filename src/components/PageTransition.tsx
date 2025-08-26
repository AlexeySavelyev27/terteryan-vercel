'use client';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  // This is now just a pass-through component
  // We'll handle all transitions in PageLayout
  return <>{children}</>;
}
