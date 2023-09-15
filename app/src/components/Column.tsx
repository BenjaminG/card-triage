import { Droppable } from 'react-beautiful-dnd'
import { CardType } from '../api/cards'
import { Card } from '@/components/Card'

export const Column: React.FC<{
  id: string
  title: string
  items: CardType[]
}> = ({ id, title, items }) => {
  return (
    <div className="bg-columnBackgroundDefault flex w-96 flex-col gap-2 rounded-md border border-slate-700 p-1">
      <h2 className="rounded-md bg-black p-4 text-xl font-semibold">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            className="flex flex-col gap-4 p-2"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items?.map((card, index) => (
              <Card
                key={`${card.id}-${card.patient_name}`}
                index={index}
                card={card}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
