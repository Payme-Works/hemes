import { Active } from '../types'

import { activeIds } from './getActiveId'

export function getActiveNameById(id: number): Active | undefined {
  return Object.keys(activeIds).find(key => activeIds[key] === id) as Active
}
