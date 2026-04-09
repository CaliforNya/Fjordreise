type SearchButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

export default function SearchButton({ onClick, disabled }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full bg-regal_navy px-6 py-3 text-lg font-semibold text-school_bus_yellow transition hover:bg-prussian_blue active:scale-[0.99] active:bg-ink_black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school_bus_yellow disabled:cursor-not-allowed disabled:bg-regal_navy/60 disabled:text-gold/80"
    >
      Søk
    </button>
  );
}
