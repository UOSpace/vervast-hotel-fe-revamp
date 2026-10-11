import * as React from "react"
import { cn } from "@/lib/utils"

export interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TableContainer({ className, children, ...props }: TableContainerProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col rounded-[12px] bg-white/70 backdrop-blur-xs border border-zinc-200/80 shadow-xs overflow-hidden animate-card-enter",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TableScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TableScrollArea({ className, children, ...props }: TableScrollAreaProps) {
  return (
    <div className={cn("flex-1 overflow-auto custom-scrollbar", className)} {...props}>
      {children}
    </div>
  )
}

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <table
      className={cn("w-full text-left border-collapse", className)}
      {...props}
    />
  )
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn(
        "sticky top-0 bg-zinc-50/90 backdrop-blur-xs border-b border-zinc-100 z-10",
        className
      )}
      {...props}
    />
  )
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn("divide-y divide-zinc-100 text-xs text-zinc-800", className)}
      {...props}
    />
  )
}

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      className={cn("border-t border-zinc-100 bg-zinc-50/50 font-medium", className)}
      {...props}
    />
  )
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean
}

export function TableRow({ className, clickable = true, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors",
        clickable ? "hover:bg-zinc-50/80 cursor-pointer group" : "hover:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 text-[9.5px] font-medium text-zinc-400 whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={cn("px-4 py-3 align-middle", className)}
      {...props}
    />
  )
}

export interface TableEmptyProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  colSpan: number
  message?: string
}

export function TableEmpty({
  colSpan,
  message = "No data found matching your criteria.",
  className,
  ...props
}: TableEmptyProps) {
  return (
    <tr className="hover:bg-transparent">
      <td
        colSpan={colSpan}
        className={cn("px-5 py-12 text-center text-zinc-400 text-xs italic", className)}
        {...props}
      >
        {message}
      </td>
    </tr>
  )
}
