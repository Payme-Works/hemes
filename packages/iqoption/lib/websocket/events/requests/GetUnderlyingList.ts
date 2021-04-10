import { UnderlyingListType } from '../../../types'
import { Request } from '../Request'

interface GetUnderlyingListRequestMessage {
  name: 'get-underlying-list'
  version: '2.0'
  body: {
    type: UnderlyingListType
  }
}

interface GetUnderlyingListRequestArgs {
  type: UnderlyingListType
}

export class GetUnderlyingListRequest extends Request<
  GetUnderlyingListRequestMessage,
  GetUnderlyingListRequestArgs
> {
  public get name(): string {
    return 'sendMessage'
  }

  public async build({
    type,
  }: GetUnderlyingListRequestArgs): Promise<GetUnderlyingListRequestMessage> {
    return {
      name: 'get-underlying-list',
      version: '2.0',
      body: {
        type,
      },
    }
  }
}
