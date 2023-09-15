import { CardType } from '../api/cards'
import { Draggable } from 'react-beautiful-dnd'
import { twMerge } from 'tailwind-merge'

export const Card: React.FC<{
  index: number
  card: CardType
}> = ({ card: { id, patient_name, status, arrhythmias }, index }) => {
  return (
    <Draggable draggableId={`${id}-${patient_name}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={twMerge(
            'flex cursor-grab flex-col gap-4 rounded-md border border-gray-900 bg-black p-4 transition-colors hover:bg-slate-700',
            snapshot.isDragging && 'border-slate-500 bg-slate-700'
          )}
        >
          <div className="flex flex-1 flex-row justify-between">
            <h2 className="text-md">{patient_name}</h2>
            <div
              className={twMerge(
                'text-primary-background inline-flex items-center rounded-full border border-transparent px-1.5 text-xs capitalize transition-colors',
                status === 'PENDING' && 'bg-red-700 hover:bg-red-700/80',
                status === 'REJECTED' && 'bg-yellow-700 hover:bg-yellow-700/80',
                status === 'DONE' && 'bg-green-700 hover:bg-green-700/80'
              )}
            >
              {status.toLowerCase()}
            </div>
          </div>
          <div className="rounded-md bg-slate-900 px-2 py-1.5 text-xs text-slate-300">
            {arrhythmias.join(', ')}
          </div>
        </div>
      )}
    </Draggable>
  )
}
