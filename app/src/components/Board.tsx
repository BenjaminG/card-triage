import { useCallback, useEffect, useReducer } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { CardType, cardsHooks } from '../api/cards'
import { Column } from '@/components/Column'
import { SearchBar } from '@/components/SearchBar'

const MIN_SEARCH_LENGTH = 2

type FilterState = {
  searchValue: string
  filterValues: string[]
  cards: Record<'todo' | 'done', CardType[]>
}

type FilterAction =
  | { type: 'SET_SEARCH_VALUE'; payload: string }
  | { type: 'TOGGLE_FILTER_VALUE'; payload: string }
  | { type: 'SET_CARDS'; payload: Record<'todo' | 'done', CardType[]> }

const filterReducer = (state: FilterState, action: FilterAction) => {
  switch (action.type) {
    case 'SET_SEARCH_VALUE':
      return { ...state, searchValue: action.payload }
    case 'TOGGLE_FILTER_VALUE':
      return {
        ...state,
        filterValues: state.filterValues.includes(action.payload)
          ? state.filterValues.filter((current) => current !== action.payload)
          : [...state.filterValues, action.payload],
      }
    case 'SET_CARDS':
      return { ...state, cards: action.payload }
    default:
      return state
  }
}

const initialState: FilterState = {
  searchValue: '',
  filterValues: [],
  cards: {
    todo: [],
    done: [],
  },
}

export const Board = () => {
  const { useGetCards } = cardsHooks

  const [state, dispatch] = useReducer(filterReducer, initialState)

  const { searchValue, filterValues, cards } = state

  const { data, isLoading } = useGetCards(undefined, {
    refetchOnWindowFocus: false,
  })

  const filterOptions = Array.from(
    new Set(data?.flatMap((card) => card.arrhythmias) ?? [])
  ).map((arrhythmia) => ({
    label: arrhythmia,
    value: arrhythmia,
  }))

  useEffect(() => {
    if (data) {
      const todo = data
        .filter((card) => card.status !== 'DONE')
        .sort((card) => (card.status === 'REJECTED' ? 1 : -1))
      const done = data.filter((card) => card.status === 'DONE')
      dispatch({ type: 'SET_CARDS', payload: { todo, done } })
    }
  }, [data])

  const filterCardsByName = useCallback(
    (cardsList: CardType[]) => {
      if (searchValue.length < MIN_SEARCH_LENGTH) return cardsList
      return cardsList.filter((card) =>
        card.patient_name.toLowerCase().includes(searchValue.toLowerCase())
      )
    },
    [searchValue]
  )

  const filterCardsByArrhythmia = useCallback(
    (cardsList: CardType[]) => {
      if (filterValues.length === 0) return cardsList
      return cardsList.filter((card) =>
        card.arrhythmias.some((arrhythmia) => filterValues.includes(arrhythmia))
      )
    },
    [filterValues]
  )

  function onDragEnd({ source, destination }: DropResult) {
    // dropped outside the list
    if (destination === undefined || destination === null) return null

    // dropped at the same position
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return null
    }

    const start = source.droppableId as keyof typeof cards
    const end = destination.droppableId as keyof typeof cards

    // dropped in the same column
    if (start === end) {
      // create new list
      const newList = cards[start].filter(
        (_, index: number) => index !== source.index
      )

      const sourceIndex = source.index
      const destinationIndex = destination.index

      // insert item at new position
      newList.splice(destinationIndex, 0, cards[start][sourceIndex])

      // update state
      dispatch({
        type: 'SET_CARDS',
        payload: { ...cards, [start]: newList },
      })
      return null
    }
    // dropped in different column
    else {
      const startList = cards[start]
      const endList = cards[end]

      const sourceIndex = source.index
      const destinationIndex = destination.index

      // remove item from source list
      const [removed] = startList.splice(sourceIndex, 1)

      // update status
      removed.status = end === 'done' ? 'DONE' : 'REJECTED'

      endList.splice(destinationIndex, 0, removed)

      // update state
      dispatch({
        type: 'SET_CARDS',
        payload: { ...cards, [start]: startList, [end]: endList },
      })
    }
  }

  function onSelectFilter(value: string) {
    dispatch({ type: 'TOGGLE_FILTER_VALUE', payload: value })
  }

  const onFilterByName = (value: string) => {
    dispatch({ type: 'SET_SEARCH_VALUE', payload: value })
  }

  const filteredTodoCardsByName = filterCardsByName(cards.todo)
  const filteredDoneCardsByName = filterCardsByName(cards.done)

  const filteredTodoCards = filterCardsByArrhythmia(filteredTodoCardsByName)
  const filteredDoneCards = filterCardsByArrhythmia(filteredDoneCardsByName)

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex h-[100vh] w-full justify-center pt-8">
      <div className="flex flex-col">
        <div className="mb-4 flex flex-row items-end justify-end border-b border-b-slate-700 pb-4">
          <SearchBar
            name={searchValue}
            options={filterOptions}
            values={filterValues}
            onFilterByName={onFilterByName}
            onSelectFilter={onSelectFilter}
          />
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="inline-flex gap-4">
            <Column id="todo" title="Todo" items={filteredTodoCards} />
            <Column id="done" title="Done" items={filteredDoneCards} />
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
