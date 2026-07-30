import type { DebtItem } from '../../domain/entities/debt-item'

interface Props {
  items: DebtItem[]
  selectedItems: DebtItem[]
  onToggle: (item: DebtItem) => void
}

export function DebtList({ items, selectedItems, onToggle }: Props) {
  const isSelected = (item: DebtItem) =>
    selectedItems.some((x) => x.creditNumber === item.creditNumber)

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <label
          key={item.creditNumber}
          className="flex cursor-pointer items-center justify-between rounded-2xl bg-white p-4 shadow"
        >
          <div>
            <p className="font-semibold">{item.period}</p>
            <p className="text-sm text-slate-500">Crédito: {item.creditNumber}</p>
            <p className="text-sm text-slate-500">Asociado: {item.memberName}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold">Bs {item.amount.toFixed(2)}</span>
            <input
              type="checkbox"
              checked={isSelected(item)}
              onChange={() => onToggle(item)}
            />
          </div>
        </label>
      ))}
    </div>
  )
}