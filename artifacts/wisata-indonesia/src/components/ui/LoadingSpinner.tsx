import { Loader2 } from "lucide-react";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className={`w-10 h-10 animate-spin text-primary ${className || ''}`} />
    </div>
  );
}
