import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

const SIDE_CLASSES = {
  left: 'inset-y-0 left-0 h-full w-72 border-r animate-slide-in-left',
  right: 'inset-y-0 right-0 h-full w-72 border-l animate-slide-in-right',
}

export function Sheet({ open, onOpenChange, side = 'left', title, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 flex flex-col overflow-y-auto border-slate-200 bg-white p-4 shadow-xl',
            'dark:border-slate-800 dark:bg-slate-950',
            SIDE_CLASSES[side],
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <DialogPrimitive.Title className="text-sm font-semibold text-slate-900 dark:text-white">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
