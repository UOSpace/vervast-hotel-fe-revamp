"use client"

import * as React from "react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { MenuDots } from "@solar-icons/react"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

function DropdownMenuContent({
  className,
  sideOffset = 4,
  align = "end",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        collisionPadding={12}
        className={cn(
          "z-[100] min-w-36 overflow-hidden rounded-xl border border-zinc-200/90 bg-white p-1 text-zinc-900 shadow-xl",
          "animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 duration-150 ease-out",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "danger"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-normal text-zinc-700 outline-none transition-colors",
        "hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        variant === "danger" &&
          "text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 focus:text-rose-700",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-zinc-100", className)}
      {...props}
    />
  )
}

export interface TableActionItem {
  label: string
  icon?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  variant?: "default" | "danger"
  disabled?: boolean
}

export interface TableActionMenuProps {
  items: TableActionItem[]
  trigger?: React.ReactNode
  align?: "start" | "end"
  className?: string
  vertical?: boolean
}

/**
 * Reusable Table Action Menu component using Radix Portal.
 * Automatically floats above table scroll areas, prevents overflow clipping,
 * and auto-flips upwards near screen/table edges.
 */
export function TableActionMenu({
  items,
  trigger,
  align = "end",
  className,
  vertical = true,
}: TableActionMenuProps) {
  return (
    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger || (
            <button
              type="button"
              className={cn(
                "p-1 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer flex items-center justify-center outline-none",
                className
              )}
              title="Actions"
            >
              <MenuDots size={15} className={vertical ? "rotate-90" : ""} />
            </button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align={align} className="min-w-32">
          {items.map((item, idx) => (
            <DropdownMenuItem
              key={idx}
              variant={item.variant}
              disabled={item.disabled}
              onClick={(e) => {
                e.stopPropagation()
                item.onClick?.(e)
              }}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
}
