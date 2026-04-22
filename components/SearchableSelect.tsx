'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Item {
  id: string
  label: string
  sublabel?: string
  searchTerm?: string
}

interface SearchableSelectProps {
  items: Item[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  initialDisplayCount?: number
  error?: string
  icon?: LucideIcon
  variant?: 'auth' | 'profile'
}

export function SearchableSelect({
  items,
  value,
  onValueChange,
  placeholder = 'Selecione uma opção...',
  emptyMessage = 'Nenhum resultado encontrado.',
  className,
  initialDisplayCount = 3,
  error,
  icon: Icon,
  variant = 'auth'
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const selectedItem = items.find((item) => item.id === value)

  const filteredItems = React.useMemo(() => {
    if (!search) return items.slice(0, initialDisplayCount)
    
    return items.filter((item) => 
      item.searchTerm?.toLowerCase().includes(search.toLowerCase()) ||
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.sublabel?.toLowerCase().includes(search.toLowerCase())
    )
  }, [items, search, initialDisplayCount])

  // Estilos variantes
  const variantStyles = {
    auth: 'h-auto py-6 bg-surface-container-highest border-none rounded-[1.25rem] text-on-surface tracking-tight',
    profile: 'h-14 bg-surface-container-highest/30 border-2 border-transparent rounded-2xl text-sm font-bold text-foreground'
  }

  return (
    <div className="space-y-2 w-full group">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer">
            {Icon && (
              <div className={cn(
                "absolute left-5 top-1/2 -translate-y-1/2 z-10 transition-colors pointer-events-none",
                open ? "text-primary" : "text-zinc-400 group-focus-within:text-primary"
              )}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                'w-full justify-between font-bold transition-all outline-none text-left duration-300',
                variantStyles[variant],
                Icon ? 'pl-14 pr-6' : 'px-6',
                !value && (variant === 'auth' ? 'text-on-surface-variant/40' : 'text-zinc-400'),
                open && (variant === 'auth' ? 'ring-2 ring-primary/30 bg-white' : 'border-primary/20 bg-background'),
                error && (variant === 'auth' ? 'ring-2 ring-destructive/30 bg-destructive/5' : 'border-destructive/30 bg-destructive/5'),
                className
              )}
            >
              <span className="truncate">
                {selectedItem 
                  ? `${selectedItem.label}${selectedItem.sublabel ? ` - ${selectedItem.sublabel}` : ''}` 
                  : placeholder}
              </span>
              <ChevronsUpDown className={cn(
                "ml-2 h-5 w-5 shrink-0 opacity-30",
                variant === 'auth' && "h-6 w-6 text-on-surface-variant/30"
              )} />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border-zinc-100 shadow-2xl rounded-2xl overflow-hidden" align="start">
          <Command shouldFilter={false} className="p-2">
            <div className="flex items-center px-1 mb-2">
              <CommandInput 
                placeholder="Pesquisar..." 
                value={search}
                onValueChange={setSearch}
                className="h-12 flex-1 text-base border-none ring-0 outline-none"
              />
            </div>

            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty className="py-6 text-center text-sm font-medium text-zinc-500">{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {(search ? filteredItems : items).map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => {
                      onValueChange(item.id)
                      setOpen(false)
                      setSearch('')
                    }}
                    className="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-emerald-50 rounded-xl transition-colors m-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900">{item.label}</span>
                      {item.sublabel && (
                        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-0.5">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4 text-primary',
                        value === item.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className={cn(
          "text-[10px] font-black uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-top-1 duration-300 text-destructive"
        )}>
          {error}
        </p>
      )}
    </div>
  )
}
