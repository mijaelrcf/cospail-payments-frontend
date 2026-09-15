import { useMemo } from 'react'
import type { DebtItem } from '../types/debt-item'
import { formatCurrency } from '../utils/format'
import { CheckIcon } from './icons'

interface Props {
  items: DebtItem[]
  selectedItems: DebtItem[]
  onToggle: (item: DebtItem) => void
}

export function DebtList({ items, selectedItems, onToggle }: Props) {
  const selectedKeys = useMemo(
    () => new Set(selectedItems.map((x) => x.creditNumber)),
    [selectedItems]
  )

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const selected = selectedKeys.has(item.creditNumber)
        return (
          <li key={`${item.creditNumber}-${item.year}-${item.month}`}>
            <label
              className={`group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm transition focus-within:ring-4 focus-within:ring-cospail-sky/25 ${
                selected
                  ? 'border-cospail-green/60 bg-cospail-green-tint'
                  : 'border-cospail-navy/10 hover:border-cospail-sky/70'
              }`}
            >
              <span className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                    selected
                      ? 'border-cospail-green bg-cospail-green text-white'
                      : 'border-cospail-navy/20 bg-white text-transparent group-hover:border-cospail-sky'
                  }`}
                >
                  <CheckIcon className="h-4 w-4" strokeWidth={3} />
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selected}
                  onChange={() => onToggle(item)}
                />
                <span>
                  <span className="block font-semibold text-cospail-ink">{item.period}</span>
                  <span className="block text-sm text-cospail-ink/60">
                    Crédito{' '}
                    <span className="font-mono font-medium text-cospail-navy">
                      {item.creditNumber}
                    </span>
                  </span>
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-display text-lg font-bold text-cospail-navy">
                  {formatCurrency(item.amount)}
                </span>
              </span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}
