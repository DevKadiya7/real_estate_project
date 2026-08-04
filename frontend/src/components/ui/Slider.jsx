import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '../../utils/cn'

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className, ...props }) {
  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      className={cn('relative flex h-5 w-full touch-none items-center select-none', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <SliderPrimitive.Range className="absolute h-full bg-brand-500" />
      </SliderPrimitive.Track>
      {value.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block h-4 w-4 rounded-full border-2 border-brand-500 bg-white shadow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 dark:bg-slate-950"
        />
      ))}
    </SliderPrimitive.Root>
  )
}
