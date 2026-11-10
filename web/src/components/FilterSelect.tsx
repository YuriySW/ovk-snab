"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option = { value: string; label: string };

export function FilterSelect({
  name,
  value,
  options,
  placeholder,
  onChange,
}: {
  name: string;
  value: string;
  options: Option[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected =
    options.find((o) => o.value === value)?.label || placeholder;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="filter-select" ref={rootRef}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        className="filter-select__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="filter-select__label">{selected}</span>
        <span className={`filter-select__chevron ${open ? "is-open" : ""}`} />
      </button>
      {open ? (
        <ul id={listId} role="listbox" className="filter-select__menu">
          <li role="option" aria-selected={!value}>
            <button
              type="button"
              className={`filter-select__option ${!value ? "is-active" : ""}`}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              {placeholder}
            </button>
          </li>
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={value === opt.value}>
              <button
                type="button"
                className={`filter-select__option ${
                  value === opt.value ? "is-active" : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
