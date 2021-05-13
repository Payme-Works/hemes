import { Request } from '../Request'

interface GetInitializationDataRequestMessage {
  name: 'get-initialization-data'
  version: '3.0'
}

export class GetInitializationDataRequest extends Request<GetInitializationDataRequestMessage> {
  public get name(): string {
    return 'sendMessage'
  }

  public async build(): Promise<GetInitializationDataRequestMessage> {
    return {
      name: 'get-initialization-data',
      version: '3.0',
    }
  }
}
