type Props = {
  onToggle: () => void;
  isEditing: boolean;
};

export default function EditRearrangement({ onToggle, isEditing }: Props) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center rounded-md border border-dashed px-2.5 py-0.5 shadow text-xs font-semibold text-foreground cursor-pointer select-none transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2"
    >
      {isEditing ? "Done" : "Edit"}
    </button>
  );
}
