import { InstrumentType } from '../../../types'
import { Request } from '../Request'

interface GetInstrumentsRequestMessage {
  name: 'get-instruments'
  version: '4.0'
  body: {
    type: InstrumentType
  }
}

interface GetInstrumentsRequestArgs {
  type: InstrumentType
}

export class GetInstrumentsRequest extends Request<
  GetInstrumentsRequestMessage,
  GetInstrumentsRequestArgs
> {
  public get name(): string {
    return 'sendMessage'
  }

  public async build({
    type,
  }: GetInstrumentsRequestArgs): Promise<GetInstrumentsRequestMessage> {
    return {
      name: 'get-instruments',
      version: '4.0',
      body: {
        type,
      },
    }
  }
}
