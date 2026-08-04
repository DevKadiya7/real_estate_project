import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Checkbox({ checked, onCheckedChange, className, id }) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white',
        'data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
        'dark:border-slate-600 dark:bg-slate-900',
        className,
      )}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-3.5 w-3.5 text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
