import { InstrumentType } from '../../../types'
import { Request } from '../Request'

interface GetTopAssetsRequestMessage {
  name: 'get-top-assets'
  version: '1.2'
  body: {
    instrument_type: InstrumentType
  }
}

interface GetTopAssetsRequestMessageRequestArgs {
  instrument_type: InstrumentType
}

export class GetTopAssetsRequest extends Request<
  GetTopAssetsRequestMessage,
  GetTopAssetsRequestMessageRequestArgs
> {
  public get name(): string {
    return 'sendMessage'
  }

  public async build({
    instrument_type,
  }: GetTopAssetsRequestMessageRequestArgs): Promise<GetTopAssetsRequestMessage> {
    return {
      name: 'get-top-assets',
      version: '1.2',
      body: {
        instrument_type,
      },
    }
  }
}
