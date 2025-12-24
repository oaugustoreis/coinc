import { PiggyBank } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <PiggyBank className="h-16 w-16 animate-bounce text-primary" />
    </div>
  );
}
