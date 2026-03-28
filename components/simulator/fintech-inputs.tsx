"use client"

import { useCallback } from "react"
import { NumericFormat, type NumberFormatValues } from "react-number-format"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Currency Field ──────────────────────────────────────────────────────────

interface CurrencyFieldProps {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  className?: string
  disabled?: boolean
}

export function CurrencyField({
  label,
  value,
  onChange,
  step = 1000,
  className,
  disabled = false,
}: CurrencyFieldProps) {
  const handleValueChange = useCallback(
    (values: NumberFormatValues) => {
      onChange(values.floatValue ?? 0)
    },
    [onChange]
  )

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // Prevent auto-selection of text on focus
    e.target.setSelectionRange(e.target.value.length, e.target.value.length)
  }, [])

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label className="text-xs text-muted-foreground truncate">{label}</Label>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden sm:flex size-8 shrink-0"
          onClick={() => onChange(Math.max(0, value - step))}
          tabIndex={-1}
          aria-label="Decrease"
          disabled={disabled}
        >
          <Minus className="size-3" />
        </Button>
        <NumericFormat
          value={value}
          onValueChange={handleValueChange}
          onFocus={handleFocus}
          thousandSeparator=","
          decimalSeparator="."
          decimalScale={0}
          allowNegative={false}
          prefix="$"
          customInput={Input}
          className="h-8 text-sm tabular-nums text-right min-w-0"
          disabled={disabled}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden sm:flex size-8 shrink-0"
          onClick={() => onChange(value + step)}
          tabIndex={-1}
          aria-label="Increase"
          disabled={disabled}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  )
}

// ─── Year Field ──────────────────────────────────────────────────────────────

interface YearFieldProps {
  label: string
  value: number
  onChange: (v: number) => void
  className?: string
  /** Optional validation error message shown in red below the field */
  error?: string
}

export function YearField({
  label,
  value,
  onChange,
  className,
  error,
}: YearFieldProps) {
  const handleValueChange = useCallback(
    (values: NumberFormatValues) => {
      onChange(values.floatValue ?? 0)
    },
    [onChange]
  )

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label className="text-xs text-muted-foreground truncate">{label}</Label>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden sm:flex size-8 shrink-0"
          onClick={() => onChange(value - 1)}
          tabIndex={-1}
          aria-label="Decrease"
        >
          <Minus className="size-3" />
        </Button>
        <NumericFormat
          value={value}
          onValueChange={handleValueChange}
          decimalScale={0}
          allowNegative={false}
          allowLeadingZeros={false}
          customInput={Input}
          className={cn(
            "h-8 text-sm tabular-nums text-center min-w-0",
            error && "border-destructive focus-visible:ring-destructive/30"
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden sm:flex size-8 shrink-0"
          onClick={() => onChange(value + 1)}
          tabIndex={-1}
          aria-label="Increase"
        >
          <Plus className="size-3" />
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Percent Field ───────────────────────────────────────────────────────────

interface PercentFieldProps {
  label: string
  value: number // stored as decimal: 0.08 = 8%
  onChange: (v: number) => void
  step?: number // in display units, e.g. 0.1 means 0.1%
  className?: string
}

export function PercentField({
  label,
  value,
  onChange,
  step = 0.1,
  className,
}: PercentFieldProps) {
  const displayValue = parseFloat((value * 100).toFixed(4))

  const handleValueChange = useCallback(
    (values: NumberFormatValues) => {
      const raw = values.floatValue ?? 0
      onChange(raw / 100)
    },
    [onChange]
  )

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label className="text-xs text-muted-foreground truncate">{label}</Label>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden sm:flex size-8 shrink-0"
          onClick={() => {
            const next = Math.max(0, displayValue - step)
            onChange(next / 100)
          }}
          tabIndex={-1}
          aria-label="Decrease"
        >
          <Minus className="size-3" />
        </Button>
        <NumericFormat
          value={displayValue}
          onValueChange={handleValueChange}
          decimalSeparator="."
          decimalScale={2}
          allowNegative={false}
          suffix="%"
          customInput={Input}
          className="h-8 text-sm tabular-nums text-right min-w-0"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden sm:flex size-8 shrink-0"
          onClick={() => {
            const next = displayValue + step
            onChange(next / 100)
          }}
          tabIndex={-1}
          aria-label="Increase"
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  )
}
