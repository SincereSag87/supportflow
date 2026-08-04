import { useState } from "react";

type LabelInputProps = {
  labels: string[];
  onChange: (labels: string[]) => void;
};

export default function LabelInput({ labels, onChange }: LabelInputProps) {
  const [draft, setDraft] = useState("");

  function addLabel() {
    const trimmed = draft.trim().toLowerCase();

    if (trimmed && !labels.includes(trimmed)) {
      onChange([...labels, trimmed]);
    }

    setDraft("");
  }

  function removeLabel(label: string) {
    onChange(labels.filter((current) => current !== label));
  }

  return (
    <div>
      {labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
            >
              {label}

              <button
                type="button"
                onClick={() => removeLabel(label)}
                aria-label={`Remove ${label} label`}
                className="text-indigo-400 transition hover:text-indigo-700 dark:hover:text-indigo-200"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addLabel();
            }
          }}
          placeholder="Add a label and press Enter"
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
        />

        <button
          type="button"
          onClick={addLabel}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Add
        </button>
      </div>
    </div>
  );
}
