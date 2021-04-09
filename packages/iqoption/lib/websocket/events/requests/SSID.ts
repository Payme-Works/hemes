import { Request } from '../Request'

export class SsidRequest extends Request<string, string> {
  public get name(): string {
    return 'ssid'
  }

  public async build(ssid: string): Promise<string> {
    return ssid
  }
}
