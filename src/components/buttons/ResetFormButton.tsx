type ResetFormButtonProps = {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

const baseClass =
  "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-school_bus_yellow bg-white/90 px-4 py-1.5 text-sm font-semibold text-ink_black shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school_bus_yellow";

const enabledClass =
  "hover:border-gold hover:bg-school_bus_yellow/15 active:bg-school_bus_yellow/25";

const disabledClass =
  "cursor-not-allowed border-school_bus_yellow/35 bg-prussian_blue/[0.06] text-prussian_blue/45 shadow-none";

export default function ResetFormButton({
  onClick,
  className = "",
  disabled = false,
}: ResetFormButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${disabled ? disabledClass : enabledClass} ${className}`.trim()}
    >
      Nullstill
    </button>
  );
}
