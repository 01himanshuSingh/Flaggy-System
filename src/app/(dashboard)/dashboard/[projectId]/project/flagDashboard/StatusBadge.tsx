'use client';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'archived';
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500',
      label: label || 'Active',
    },
    inactive: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      dot: 'bg-gray-500',
      label: label || 'Inactive',
    },
    archived: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      dot: 'bg-orange-500',
      label: label || 'Archived',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.text} text-sm font-medium`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {config.label}
    </div>
  );
}
