import React from 'react';

interface BadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'sm', className = '' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  let colorClasses = 'bg-[#F0F2F5] text-[#333333] border-[#D4DCE6]';

  switch (status?.toUpperCase()) {
    case 'APPLIED':
      colorClasses = 'bg-[#EAF2FC] text-[#356F9D] border-[#B8C6D6]';
      break;
    case 'UNDER_REVIEW':
      colorClasses = 'bg-[#FFF0CE] text-[#855A00] border-[#E6D3A3]';
      break;
    case 'SHORTLISTED':
      colorClasses = 'bg-[#DDEED8] text-[#285C2A] border-[#BFDDB7]';
      break;
    case 'INTERVIEW':
      colorClasses = 'bg-[#EAF2FC] text-[#255278] border-[#7FA8E8]';
      break;
    case 'SELECTED':
    case 'VERIFIED':
    case 'ACTIVE':
      colorClasses = 'bg-[#DDEED8] text-[#285C2A] border-[#A2CF98] font-semibold';
      break;
    case 'REJECTED':
    case 'SUSPENDED':
    case 'CANCELLED':
      colorClasses = 'bg-[#FDE8E8] text-[#C94242] border-[#F4B8B8]';
      break;
    case 'WITHDRAWN':
    case 'CLOSED':
      colorClasses = 'bg-[#F0F2F5] text-[#666666] border-[#D4DCE6]';
      break;
    case 'PENDING':
    case 'PENDING_VERIFICATION':
    case 'DRAFT':
      colorClasses = 'bg-[#FFF0CE] text-[#855A00] border-[#E6D3A3]';
      break;
    case 'REMOTE':
      colorClasses = 'bg-[#EAF2FC] text-[#356F9D] border-[#B8C6D6]';
      break;
    case 'HYBRID':
      colorClasses = 'bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]';
      break;
    case 'ONSITE':
      colorClasses = 'bg-[#F0F2F5] text-[#475569] border-[#CBD5E1]';
      break;
    default:
      colorClasses = 'bg-[#F0F2F5] text-[#333333] border-[#D4DCE6]';
  }

  const label = status ? status.replace(/_/g, ' ') : '';

  return (
    <span
      className={`inline-flex items-center justify-center font-medium border rounded-sm tracking-wide ${sizeClasses} ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};
