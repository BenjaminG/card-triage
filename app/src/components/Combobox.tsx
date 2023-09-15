import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bars3Icon, CheckIcon } from '@/components/Icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { twMerge } from 'tailwind-merge'

export type OptionType = {
  label: string
  value: string
}

export const Combobox: React.FC<{
  headerAddon?: React.ReactNode
  options: OptionType[]
  values: string[]
  onSelect: (value: string) => void
}> = ({ headerAddon, options, values, onSelect }) => {
  return (
    <Popover>
      <PopoverTrigger asChild className="relative">
        <div>
          {values.length > 0 && (
            <Badge className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-green-500 p-0 text-[8px]">
              {values.length}
            </Badge>
          )}
          <Button size="sm" variant="secondary" className="h-8 w-8 px-0">
            <Bars3Icon className="h-4 w-4" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {headerAddon}
          <CommandGroup>
            {options.map(({ label, value }) => (
              <CommandItem
                value={label}
                key={value}
                onSelect={() => {
                  onSelect(value)
                }}
              >
                <CheckIcon
                  className={twMerge(
                    'mr-2 h-4 w-4',
                    values.includes(value) ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
