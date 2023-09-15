import { SearchIcon } from '@/components/Icons'
import { Combobox } from '@/components/Combobox'

export const SearchBar: React.FC<{
  name: string
  options: React.ComponentProps<typeof Combobox>['options']
  values: string[]
  onFilterByName: (value: string) => void
  onSelectFilter: (value: string) => void
}> = ({ name, options, values, onFilterByName, onSelectFilter }) => {
  return (
    <>
      <label className="relative mr-4 cursor-pointer">
        <div className="col absolute left-0 z-10 flex h-8 w-8 items-center justify-center">
          <SearchIcon className="pointer-events-none h-4 w-4" />
        </div>
        <input
          className="h-8 cursor-pointer rounded-md border border-gray-800 bg-gray-800 pl-10 pr-4 text-sm text-white transition-[border,_background] focus:border-gray-600 focus:bg-gray-700 focus:outline-none"
          type="search"
          name="search"
          value={name}
          onChange={(e) => onFilterByName(e.target.value)}
          placeholder="Patient name"
        />
      </label>
      <Combobox
        headerAddon={
          <div className="bg-black px-3 py-1.5 text-xs uppercase">
            Arrhythmia type
          </div>
        }
        options={options}
        values={values}
        onSelect={(value) => onSelectFilter(value)}
      />
    </>
  )
}
