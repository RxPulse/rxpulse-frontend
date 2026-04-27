import { GitBranch } from 'lucide-react';

export default function VersionBadge({ variant = 'compact' }) {
  if (variant === 'full') {
    return (
      <div className="flex items-center gap-2">
        <GitBranch size={16} className="text-dark-400" />
        <span className="font-mono text-sm text-dark-200">frontend-v1.0.0</span>
        <span className="badge-green">Active</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-dark-800 border border-dark-700">
      <div className="w-1.5 h-1.5 rounded-full bg-fresh-500 animate-pulse"></div>
      <span className="font-mono text-[10px] text-fresh-400">v1.0.0</span>
      <span className="text-[10px] text-dark-400 uppercase font-semibold">Green</span>
    </div>
  );
}
