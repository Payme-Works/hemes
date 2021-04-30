import { Request } from '../Request'

interface GetProfileRequestMessage {
  name: 'core.get-profile'
  version: '1.0'
  body: {}
}

export class GetProfileRequest extends Request<GetProfileRequestMessage> {
  public get name(): string {
    return 'sendMessage'
  }

  public async build(): Promise<GetProfileRequestMessage> {
    return {
      name: 'core.get-profile',
      version: '1.0',
      body: {},
    }
  }
}
