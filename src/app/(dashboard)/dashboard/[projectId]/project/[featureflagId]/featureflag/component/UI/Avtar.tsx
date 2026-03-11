interface AvatarProps {
  initials: string;
  color?: string;
  size?: number;
}

export function Avatar({
  initials,
  color = "#6366f1",
  size = 32,
}: AvatarProps) {
  return (
    <span
      style={{
        width: size,
        height: size,
        background: color,
      }}
      className="flex items-center justify-center rounded-full text-white font-bold text-sm"
    >
      {initials}
    </span>
  );
}