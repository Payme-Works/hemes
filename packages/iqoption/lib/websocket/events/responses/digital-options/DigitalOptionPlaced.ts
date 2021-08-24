import { Response } from '../../Response'

export interface DigitalOptionPlaced {
  id: number
  message?: 'active_suspended'
}

export class DigitalOptionPlacedResponse extends Response<DigitalOptionPlaced> {
  public get name(): string {
    return 'digital-option-placed'
  }
}
