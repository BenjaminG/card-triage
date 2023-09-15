import { Zodios } from '@zodios/core'
import { ZodiosHooks } from '@zodios/react'
import { z } from 'zod'

const API_URL = import.meta.env.VITE_API_URL

export const cardSchema = z.object({
  arrhythmias: z.array(z.enum(['AFib', 'AV Block', 'Pause', 'PSVC', 'PVC'])),
  created_date: z.string(),
  id: z.number(),
  patient_name: z.string(),
  status: z.enum(['REJECTED', 'DONE', 'PENDING']),
})

export type CardType = z.infer<typeof cardSchema>

const cardsClient = new Zodios(API_URL!, [
  {
    method: 'get',
    path: '/cards',
    alias: 'getCards',
    description: 'Get all cards',
    response: z.array(cardSchema),
  },
])

export const cardsHooks = new ZodiosHooks('cardsAPI', cardsClient)
