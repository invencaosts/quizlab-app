'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
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
  sublabel?: string // E.g., UF or City
  searchTerm?: string // Combined string for better search
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
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const selectedItem = items.find((item) => item.id === value)

  // Filtragem customizada para buscar por múltiplos campos
  const filteredItems = React.useMemo(() => {
    if (!search) return items.slice(0, initialDisplayCount)
    
    return items.filter((item) => 
      item.searchTerm?.toLowerCase().includes(search.toLowerCase()) ||
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.sublabel?.toLowerCase().includes(search.toLowerCase())
    )
  }, [items, search, initialDisplayCount])

  return (
    <div className="space-y-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between h-auto py-6 px-6 bg-surface-container-highest border-none outline-none font-bold text-base tracking-tight rounded-[1.25rem] transition-all duration-300',
              !value && 'text-on-surface-variant/20',
              open && 'ring-2 ring-primary/30 bg-white',
              error && 'ring-2 ring-destructive/30 bg-destructive/5',
              className
            )}
          >

            <span className="truncate">
              {selectedItem 
                ? `${selectedItem.label}${selectedItem.sublabel ? ` - ${selectedItem.sublabel}` : ''}` 
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-6 w-6 shrink-0 text-on-surface-variant/30" />

          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false} className="p-2">
            <div className="flex items-center px-1 mb-2">
              <CommandInput 
                placeholder="Pesquisar..." 
                value={search}
                onValueChange={setSearch}
                className="h-14 flex-1 text-base"
              />
            </div>

            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty className="py-6 text-center text-sm">{emptyMessage}</CommandEmpty>
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
                    className="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-on-surface">{item.label}</span>
                      {item.sublabel && (
                        <span className="text-xs text-on-surface-variant font-bold uppercase">
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
        <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-top-1 duration-300">
          {error}
        </p>
      )}
    </div>
  )
}

