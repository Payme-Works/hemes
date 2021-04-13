import { AxiosInstance } from 'axios'

import { Profile } from './websocket/events/responses/Profile'
import { WebSocketClient } from './websocket/WebSocketClient'

export interface LogInCredentials {
  email: string
  password: string
}

export interface BaseIQOptionProvider {
  logIn(credentials: LogInCredentials): Promise<BaseIQOptionAccount>
}

export interface BaseIQOptionAccount {
  api: AxiosInstance
  webSocket: WebSocketClient

  getProfile(): Promise<Profile>
  getActiveProfit<Type extends InstrumentType>(
    active: Active,
    instrumentType: Type,
    ...expirationPeriod: Type extends 'binary-option' ? [ExpirationPeriod] : []
  ): Promise<number>
}

export interface WebSocketEvent<Message = any> {
  request_id?: string
  name: string
  msg: Message
  status?: number
  microserviceName?: string
}

export interface WebSocketEventHistory<Message = any>
  extends WebSocketEvent<Message> {
  at: number
}

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export type CheckForUnion<T, Error, Ok> = [T] extends [UnionToIntersection<T>]
  ? Ok
  : Error

export type OptionalSpread<Arg = undefined> = Arg extends undefined ? [] : [Arg]

export interface WaitForOptions {
  requestId?: string
  maxAttempts?: number
  delay?: number
}

export interface BaseWebSocketClient {
  history: WebSocketEventHistory[]

  subscribe(): void

  send<Message, Args = undefined>(
    Request: EventRequestConstructor<Message, Args>,
    args?: CheckForUnion<Args, never, Args>
  ): Promise<WebSocketEvent<Message>>
  waitFor<Message>(
    Response: EventResponseConstructor<Message>,
    options?: WaitForOptions
  ): Promise<WebSocketEventHistory<Message> | undefined>
}

export type EventRequestConstructor<Message, Args> = new () => BaseEventRequest<
  Message,
  Args
>

export type EventResponseConstructor<
  Message
> = new () => BaseEventResponse<Message>

export interface BaseEventRequest<Message = any, Args = undefined> {
  name: string

  build(args: Args): Promise<Message>
}

export interface BaseEventResponse<Message = any> {
  name: string

  test(event: WebSocketEvent<Message>): Promise<boolean>
}

export interface BaseEventSubscriber<Message = any> {
  webSocket: BaseWebSocketClient

  name: string

  update(event: WebSocketEvent<Message>): void
}

export type UnderlyingType = 'digital-option'

export type InstrumentType =
  | 'binary-option'
  | 'turbo-option'
  | 'digital-option'
  | 'cfd'
  | 'forex'
  | 'crypto'

export type ExpirationPeriod = 'm1' | 'm5' | 'm15' | 'm30' | 'h1'

export type Active =
  | 'EURUSD'
  | 'EURGBP'
  | 'GBPJPY'
  | 'EURJPY'
  | 'GBPUSD'
  | 'USDJPY'
  | 'AUDCAD'
  | 'NZDUSD'
  | 'USDRUB'
  | 'AMAZON'
  | 'APPLE'
  | 'BAIDU'
  | 'CISCO'
  | 'FACEBOOK'
  | 'GOOGLE'
  | 'INTEL'
  | 'MSFT'
  | 'YAHOO'
  | 'AIG'
  | 'CITI'
  | 'COKE'
  | 'GE'
  | 'GM'
  | 'GS'
  | 'JPM'
  | 'MCDON'
  | 'MORSTAN'
  | 'NIKE'
  | 'USDCHF'
  | 'XAUUSD'
  | 'XAGUSD'
  | 'EURUSD-OTC'
  | 'EURGBP-OTC'
  | 'USDCHF-OTC'
  | 'EURJPY-OTC'
  | 'NZDUSD-OTC'
  | 'GBPUSD-OTC'
  | 'GBPJPY-OTC'
  | 'USDJPY-OTC'
  | 'AUDCAD-OTC'
  | 'ALIBABA'
  | 'YANDEX'
  | 'AUDUSD'
  | 'USDCAD'
  | 'AUDJPY'
  | 'GBPCAD'
  | 'GBPCHF'
  | 'GBPAUD'
  | 'EURCAD'
  | 'CHFJPY'
  | 'CADCHF'
  | 'EURAUD'
  | 'TWITTER'
  | 'FERRARI'
  | 'TESLA'
  | 'USDNOK'
  | 'EURNZD'
  | 'USDSEK'
  | 'USDTRY'
  | 'MMM:US'
  | 'ABT:US'
  | 'ABBV:US'
  | 'ACN:US'
  | 'ATVI:US'
  | 'ADBE:US'
  | 'AAP:US'
  | 'AA:US'
  | 'AGN:US'
  | 'MO:US'
  | 'AMGN:US'
  | 'T:US'
  | 'ADSK:US'
  | 'BAC:US'
  | 'BBY:US'
  | 'BA:US'
  | 'BMY:US'
  | 'CAT:US'
  | 'CTL:US'
  | 'CVX:US'
  | 'CTAS:US'
  | 'CTXS:US'
  | 'CL:US'
  | 'CMCSA:US'
  | 'CXO:US'
  | 'COP:US'
  | 'ED:US'
  | 'COST:US'
  | 'CVS:US'
  | 'DHI:US'
  | 'DHR:US'
  | 'DRI:US'
  | 'DVA:US'
  | 'DAL:US'
  | 'DVN:US'
  | 'DO:US'
  | 'DLR:US'
  | 'DFS:US'
  | 'DISCA:US'
  | 'DOV:US'
  | 'DTE:US'
  | 'DNB:US'
  | 'ETFC:US'
  | 'EMN:US'
  | 'EBAY:US'
  | 'ECL:US'
  | 'EIX:US'
  | 'EMR:US'
  | 'ETR:US'
  | 'EQT:US'
  | 'EFX:US'
  | 'EQR:US'
  | 'ESS:US'
  | 'EXPD:US'
  | 'EXR:US'
  | 'XOM:US'
  | 'FFIV:US'
  | 'FAST:US'
  | 'FRT:US'
  | 'FDX:US'
  | 'FIS:US'
  | 'FITB:US'
  | 'FSLR:US'
  | 'FE:US'
  | 'FISV:US'
  | 'FLS:US'
  | 'FMC:US'
  | 'FBHS:US'
  | 'FCX:US'
  | 'FTR:US'
  | 'GILD:US'
  | 'HAS:US'
  | 'HON:US'
  | 'IBM:US'
  | 'KHC:US'
  | 'LMT:US'
  | 'MA:US'
  | 'MDT:US'
  | 'MU:US'
  | 'NFLX:US'
  | 'NEE:US'
  | 'NVDA:US'
  | 'PYPL:US'
  | 'PFE:US'
  | 'PM:US'
  | 'PG:US'
  | 'QCOM:US'
  | 'DGX:US'
  | 'RTN:US'
  | 'CRM:US'
  | 'SLB:US'
  | 'SBUX:US'
  | 'SYK:US'
  | 'DIS:US'
  | 'TWX:US'
  | 'VZ:US'
  | 'V:US'
  | 'WMT:US'
  | 'WBA:US'
  | 'WFC:US'
  | 'SNAP'
  | 'DUBAI'
  | 'TA25'
  | 'AMD'
  | 'ALGN'
  | 'ANSS'
  | 'DRE'
  | 'IDXX'
  | 'RMD'
  | 'SU'
  | 'TFX'
  | 'TMUS'
  | 'QQQ'
  | 'SPY'
  | 'BTCUSD'
  | 'XRPUSD'
  | 'ETHUSD'
  | 'LTCUSD'
  | 'DSHUSD'
  | 'BCHUSD'
  | 'OMGUSD'
  | 'ZECUSD'
  | 'ETCUSD'
  | 'BTCUSD-L'
  | 'ETHUSD-L'
  | 'LTCUSD-L'
  | 'BCHUSD-L'
  | 'BTGUSD'
  | 'QTMUSD'
  | 'XLMUSD'
  | 'TRXUSD'
  | 'EOSUSD'
  | 'USDINR'
  | 'USDPLN'
  | 'USDBRL'
  | 'USDZAR'
  | 'DBX'
  | 'SPOT'
  | 'USDSGD'
  | 'USDHKD'
  | 'LLOYL-CHIX'
  | 'VODL-CHIX'
  | 'BARCL-CHIX'
  | 'TSCOL-CHIX'
  | 'BPL-CHIX'
  | 'HSBAL-CHIX'
  | 'RBSL-CHIX'
  | 'BLTL-CHIX'
  | 'MRWL-CHIX'
  | 'STANL-CHIX'
  | 'RRL-CHIX'
  | 'MKSL-CHIX'
  | 'BATSL-CHIX'
  | 'ULVRL-CHIX'
  | 'EZJL-CHIX'
  | 'ADSD-CHIX'
  | 'ALVD-CHIX'
  | 'BAYND-CHIX'
  | 'BMWD-CHIX'
  | 'CBKD-CHIX'
  | 'COND-CHIX'
  | 'DAID-CHIX'
  | 'DBKD-CHIX'
  | 'DPWD-CHIX'
  | 'DTED-CHIX'
  | 'EOAND-CHIX'
  | 'MRKD-CHIX'
  | 'SIED-CHIX'
  | 'TKAD-CHIX'
  | 'VOW3D-CHIX'
  | 'PIRCM-CHIX'
  | 'PSTM-CHIX'
  | 'TITM-CHIX'
  | 'CSGNZ-CHIX'
  | 'NESNZ-CHIX'
  | 'ROGZ-CHIX'
  | 'UBSGZ-CHIX'
  | 'SANE-CHIX'
  | 'BBVAE-CHIX'
  | 'TEFE-CHIX'
  | 'AIRP-CHIX'
  | 'HEIOA-CHIX'
  | 'ORP-CHIX'
  | 'AUDCHF'
  | 'AUDNZD'
  | 'CADJPY'
  | 'EURCHF'
  | 'GBPNZD'
  | 'NZDCAD'
  | 'NZDJPY'
  | 'EURNOK'
  | 'CHFSGD'
  | 'EURSGD'
  | 'USDMXN'
  | 'JUVEM'
  | 'ASRM'
  | 'MANU'
  | 'UKOUSD'
  | 'XPTUSD'
  | 'USOUSD'
  | 'W1'
  | 'AUDDKK'
  | 'AUDMXN'
  | 'AUDNOK'
  | 'AUDSEK'
  | 'AUDSGD'
  | 'AUDTRY'
  | 'CADMXN'
  | 'CADNOK'
  | 'CADPLN'
  | 'CADTRY'
  | 'CHFDKK'
  | 'CHFNOK'
  | 'CHFSEK'
  | 'CHFTRY'
  | 'DKKPLN'
  | 'DKKSGD'
  | 'EURDKK'
  | 'EURMXN'
  | 'EURTRY'
  | 'EURZAR'
  | 'GBPILS'
  | 'GBPMXN'
  | 'GBPNOK'
  | 'GBPPLN'
  | 'GBPSEK'
  | 'GBPSGD'
  | 'GBPTRY'
  | 'NOKDKK'
  | 'NOKJPY'
  | 'NOKSEK'
  | 'NZDDKK'
  | 'NZDMXN'
  | 'NZDNOK'
  | 'NZDSEK'
  | 'NZDSGD'
  | 'NZDTRY'
  | 'NZDZAR'
  | 'PLNSEK'
  | 'SEKDKK'
  | 'SEKJPY'
  | 'SGDJPY'
  | 'USDDKK'
  | 'NZDCHF'
  | 'GBPHUF'
  | 'USDCZK'
  | 'USDHUF'
  | 'CADSGD'
  | 'EURCZK'
  | 'EURHUF'
  | 'USDTHB'
  | 'IOTUSD-L'
  | 'XLMUSD-L'
  | 'NEOUSD-L'
  | 'ADAUSD-L'
  | 'XEMUSD-L'
  | 'XRPUSD-L'
  | 'EEM'
  | 'FXI'
  | 'IWM'
  | 'GDX'
  | 'XOP'
  | 'XLK'
  | 'XLE'
  | 'XLU'
  | 'IEMG'
  | 'XLY'
  | 'IYR'
  | 'SQQQ'
  | 'OIH'
  | 'SMH'
  | 'EWJ'
  | 'XLB'
  | 'DIA'
  | 'TLT'
  | 'SDS'
  | 'EWW'
  | 'XME'
  | 'QID'
  | 'AUS200'
  | 'FRANCE40'
  | 'GERMANY30'
  | 'HONGKONG50'
  | 'SPAIN35'
  | 'US30'
  | 'USNDAQ100'
  | 'JAPAN225'
  | 'USSPX500'
  | 'UK100'
  | 'TRXUSD-L'
  | 'EOSUSD-L'
  | 'BNBUSD-L'
  | 'ACB'
  | 'CGC'
  | 'CRON'
  | 'GWPH'
  | 'MJ'
  | 'TLRY'
  | 'BUD'
  | 'LYFT'
  | 'PINS'
  | 'ZM'
  | 'UBER'
  | 'MELI'
  | 'BYND'
  | 'BSVUSD-L'
  | 'ONTUSD-L'
  | 'ATOMUSD-L'
  | 'WORK'
  | 'FDJP'
  | 'CAN'
  | 'VIAC'
  | 'TFC'
