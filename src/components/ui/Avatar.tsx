/** Avatar circular con anillo degradado (como el perfil de las referencias). */
export function Avatar({ emoji = '🧑‍🎨', size = 56, className = '' }: { emoji?: string; size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 rounded-full bg-linear-to-br from-sky-strong via-lavender-strong to-pink-strong p-[3px] shadow-soft ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className="grid place-items-center rounded-full bg-linear-to-b from-sun to-peach ring-2 ring-white"
        style={{ fontSize: size * 0.5 }}
      >
        {emoji}
      </span>
    </span>
  );
}
