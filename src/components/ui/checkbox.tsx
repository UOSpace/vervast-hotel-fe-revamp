"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, 'onChange'> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | { target: { checked: boolean } }) => void;
}

function Checkbox({
  className,
  checked,
  onCheckedChange,
  onChange,
  ...props
}: CheckboxProps) {
  const handleCheckedChange = (state: boolean | 'indeterminate') => {
    onCheckedChange?.(state);
    if (onChange) {
      const isChecked = state === true;
      onChange({ target: { checked: isChecked } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      onCheckedChange={handleCheckedChange}
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-zinc-300 bg-white transition-colors duration-150 outline-none select-none cursor-pointer",
        "hover:border-zinc-400 hover:bg-zinc-50/50",
        "focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:border-zinc-900",
        "data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 data-[state=checked]:text-white",
        "data-[state=indeterminate]:bg-zinc-900 data-[state=indeterminate]:border-zinc-900 data-[state=indeterminate]:text-white",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-300 disabled:hover:bg-white",
        "shadow-2xs",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current pointer-events-none"
      >
        {checked === 'indeterminate' ? (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="size-2.5"
          >
            <line x1="3.5" y1="8" x2="12.5" y2="8" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-2.5"
          >
            <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
          </svg>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
