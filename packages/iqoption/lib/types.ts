import { AxiosInstance } from 'axios'

import { Balance } from './websocket/events/responses/GetBalances'
import { ProfileResult } from './websocket/events/responses/GetProfile'
import {
  Position,
  PositionStatus,
} from './websocket/events/responses/PositionChanged'
import { PositionState } from './websocket/events/responses/PositionsState'
import { WebSocketClient } from './websocket/WebSocketClient'

// .

export interface LogInCredentials {
  email: string
  password: string
}

export interface BaseIQOptionProvider {
  enableCorsBypass(): Promise<void>
  logIn(credentials: LogInCredentials): Promise<BaseIQOptionAccount>
}

export interface PlaceDigitalOption {
  active: ActivePair
  direction: PositionDirection
  expiration_period: DigitalOptionExpirationPeriod
  price: number
}

export interface OpenBinaryOption {
  active: Active
  direction: PositionDirection
  expiration_period: ExpirationPeriod
  price: number
}

export interface GetPositionOptions {
  status?: PositionStatus
  timeout?: number
}

export type OpenAssets = {
  [type in InstrumentType]: Active[]
}

export interface BaseIQOptionAccount {
  api: AxiosInstance
  webSocket: WebSocketClient

  getProfile(): Promise<Profile>
  setBalanceMode(mode: BalanceMode): Promise<void>
  getActiveProfit<Type extends InstrumentType>(
    active: Active,
    instrumentType: Type,
    ...expirationPeriod: Type extends 'binary-option' ? [ExpirationPeriod] : []
  ): Promise<number>
  isActiveEnabled<Type extends InstrumentType>(
    active: Active,
    instrumentType: Type,
    ...expirationPeriod: Type extends 'binary-option' ? [ExpirationPeriod] : []
  ): Promise<boolean>
  getOpenAssets(): Promise<OpenAssets>
  placeDigitalOption(data: PlaceDigitalOption): Promise<Position>
  openBinaryOption(data: OpenBinaryOption): Promise<Position>
  getPosition(
    positionId: string,
    options?: GetPositionOptions
  ): Promise<Position>
  getPositionState(positionId: string): Promise<PositionState>
  getCandles(
    active: Active,
    expirationPeriod: ExpirationPeriod,
    count: number,
    toDate?: Date | number
  ): Promise<Candle[]>
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

export interface WaitForOptions<Message> {
  requestId?: string
  timeout?: number
  delay?: number
  test?: (event: WebSocketEvent<Message>) => boolean
}

export interface BaseWebSocketClient {
  history: WebSocketEventHistory[]

  subscribe(): Promise<void>

  send<Message, Args = undefined>(
    Request: EventRequestConstructor<Message, Args>,
    args?: CheckForUnion<Args, never, Args>
  ): Promise<WebSocketEvent<Message>>
  waitFor<Message>(
    Response: EventResponseConstructor<Message>,
    options?: WaitForOptions<Message>
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

export interface Profile extends Omit<ProfileResult, 'balances'> {
  balances: Balance[]
}

export type BalanceMode = 'real' | 'practice'

export type UnderlyingType = 'digital-option'

export type InstrumentType = 'binary-option' | 'turbo-option' | 'digital-option'

export const allInstrumentTypes: InstrumentType[] = [
  'binary-option',
  'turbo-option',
  'digital-option',
]

export interface Candle {
  close: number
  from: number
  id: number
  max: number
  min: number
  open: number
  to: number
  volume: number
}

export type DigitalOptionExpirationPeriod = 'm1' | 'm5' | 'm15'

export type ExpirationPeriod = 'm1' | 'm5' | 'm15' | 'm30' | 'h1'

export type PositionDirection = 'call' | 'put'

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
  | 'BTC'

export enum ActivePair {
  ALL = 0,
  EURRUB = 9,
  COMMBK = 13,
  DAIM = 14,
  DBFRA = 15,
  EOAN = 16,
  BPLON = 23,
  GAZPROM = 27,
  ROSNEFT = 28,
  SBERS = 29,
  YAHOO = 40,
  AIG = 41,
  BOA = 42,
  VERIZON = 56,
  WMART = 57,
  DAX30 = 66,
  DJIA = 67,
  FTSE = 68,
  NSDQ = 69,
  NK = 70,
  SP = 71,
  BTCX = 73,

  EURUSD_OTC = 76,
  EURGBP_OTC = 77,
  USDCHF_OTC = 78,
  EURJPY_OTC = 79,
  NZDUSD_OTC = 80,
  GBPUSD_OTC = 81,
  EURRUB_OTC = 82,
  USDRUB_OTC = 83,
  GBPJPY_OTC = 84,
  USDJPY_OTC = 85,
  AUDCAD_OTC = 86,

  YANDEX = 95,

  PAN = 97,

  GBPCHF = 103,
  GBPAUD = 104,

  BMW = 110,
  LUFTHANSA = 111,

  SMI_INDEX = 166,
  SSE_INDEX = 169,
  HANG_SENG = 170,

  SPASX200 = 208,
  TOPIX500 = 209,
  DX = 210,

  SIN_FAKE = 213,

  BRENT_OIL_JUL_16 = 215,

  NTDOY = 218,
  USDTRY = 220,

  BTCUSD = 816,
  XRPUSD = 817,
  ETHUSD = 818,
  LTCUSD = 819,
  DSHUSD = 821,
  BCHUSD = 824,
  OMGUSD = 825,
  ZECUSD = 826,
  ETCUSD = 829,
  BTCUSD_L = 830,
  ETHUSD_L = 831,
  LTCUSD_L = 834,
  BCHUSD_L = 836,
  QTMUSD = 845,
  XLMUSD = 847,
  TRXUSD = 858,
  EOSUSD = 864,
  IOTUSD_L = 1116,
  XLMUSD_L = 1117,
  NEOUSD_L = 1118,
  ADAUSD_L = 1119,
  XEMUSD_L = 1120,
  TRXUSD_L = 1242,
  EOSUSD_L = 1244,

  EURUSD = 1,
  EURGBP = 2,
  GBPJPY = 3,
  EURJPY = 4,
  GBPUSD = 5,
  USDJPY = 6,
  AUDCAD = 7,
  NZDUSD = 8,
  USDRUB = 10,
  USDCHF = 72,
  AUDUSD = 99,
  USDCAD = 100,
  AUDJPY = 101,
  GBPCAD = 102,
  EURCAD = 105,
  CHFJPY = 106,
  CADCHF = 107,
  EURAUD = 108,
  USDNOK = 168,
  EURNZD = 212,
  USDSEK = 219,
  USDPLN = 866,
  AUDCHF = 943,
  AUDNZD = 944,
  CADJPY = 945,
  EURCHF = 946,
  GBPNZD = 947,
  NZDCAD = 948,
  NZDJPY = 949,
  EURNOK = 951,
  CHFSGD = 952,
  EURSGD = 955,
  AUDNOK = 986,
  AUDSEK = 988,
  AUDSGD = 989,
  CADNOK = 993,
  CADPLN = 994,
  EURDKK = 1007,
  EURMXN = 1008,
  EURZAR = 1011,
  NOKJPY = 1024,
  NOKSEK = 1025,
  NZDSGD = 1031,
  SEKJPY = 1038,
  SGDJPY = 1041,
  USDDKK = 1045,
  NZDCHF = 1048,
  USDCZK = 1050,
  USDHUF = 1051,

  AMAZON = 31,
  APPLE = 32,
  BAIDU = 33,
  CISCO = 34,
  FACEBOOK = 35,
  GOOGLE = 36,
  INTEL = 37,
  MSFT = 38,
  CITI = 45,
  COKE = 46,
  GE = 48,
  GM = 49,
  GS = 50,
  JPM = 51,
  MCDON = 52,
  MORSTAN = 53,
  NIKE = 54,
  XAUUSD = 74,
  XAGUSD = 75,
  ALIBABA = 87,
  TWITTER = 113,
  FERRARI = 133,
  TESLA = 167,
  MMM_US = 252,
  ABT_US = 253,
  ABBV_US = 254,
  ACN_US = 255,
  ATVI_US = 256,
  ADBE_US = 258,
  AAP_US = 259,
  AA_US = 269,
  MO_US = 278,
  AMGN_US = 290,
  T_US = 303,
  ADSK_US = 304,
  BAC_US = 313,
  BBY_US = 320,
  BA_US = 324,
  BMY_US = 328,
  CAT_US = 338,
  CTL_US = 344,
  CVX_US = 349,
  CTAS_US = 356,
  CTXS_US = 360,
  CL_US = 365,
  CMCSA_US = 366,
  CXO_US = 369,
  COP_US = 370,
  ED_US = 371,
  COST_US = 374,
  CVS_US = 379,
  DHI_US = 380,
  DHR_US = 381,
  DRI_US = 382,
  DVA_US = 383,
  DAL_US = 386,
  DVN_US = 388,
  DLR_US = 390,
  DFS_US = 391,
  DISCA_US = 392,
  DOV_US = 397,
  DTE_US = 400,
  ETFC_US = 404,
  EMN_US = 405,
  EBAY_US = 407,
  ECL_US = 408,
  EIX_US = 409,
  EMR_US = 413,
  ETR_US = 415,
  EQT_US = 417,
  EFX_US = 418,
  EQR_US = 420,
  ESS_US = 421,
  EXPD_US = 426,
  EXR_US = 428,
  XOM_US = 429,
  FFIV_US = 430,
  FRT_US = 433,
  FIS_US = 435,
  FITB_US = 436,
  FSLR_US = 437,
  FE_US = 438,
  FISV_US = 439,
  FLS_US = 441,
  FMC_US = 443,
  FBHS_US = 448,
  FCX_US = 450,
  GILD_US = 460,
  HAS_US = 471,
  HON_US = 480,
  IBM_US = 491,
  KHC_US = 513,
  LMT_US = 528,
  MA_US = 542,
  MDT_US = 548,
  MU_US = 553,
  NFLX_US = 569,
  NEE_US = 575,
  NVDA_US = 586,
  PYPL_US = 597,
  PFE_US = 603,
  PM_US = 605,
  PG_US = 617,
  QCOM_US = 626,
  DGX_US = 628,
  RTN_US = 630,
  CRM_US = 645,
  SLB_US = 647,
  SBUX_US = 666,
  SYK_US = 670,
  DIS_US = 689,
  VZ_US = 723,
  V_US = 726,
  WMT_US = 729,
  WBA_US = 730,
  SNAP = 756,
  AMD = 760,
  ALGN = 761,
  ANSS = 762,
  DRE = 772,
  IDXX = 775,
  RMD = 781,
  SU = 783,
  TFX = 784,
  TMUS = 785,
  QQQ = 796,
  SPY = 808,
  DBX = 889,
  SPOT = 891,
  LLOYL_CHIX = 894,
  VODL_CHIX = 895,
  BARCL_CHIX = 896,
  TSCOL_CHIX = 897,
  BPL_CHIX = 898,
  HSBAL_CHIX = 899,
  RBSL_CHIX = 900,
  BLTL_CHIX = 901,
  MRWL_CHIX = 902,
  STANL_CHIX = 903,
  RRL_CHIX = 904,
  MKSL_CHIX = 905,
  BATSL_CHIX = 906,
  ULVRL_CHIX = 908,
  EZJL_CHIX = 909,
  ADSD_CHIX = 910,
  ALVD_CHIX = 911,
  BAYND_CHIX = 912,
  BMWD_CHIX = 913,
  CBKD_CHIX = 914,
  COND_CHIX = 915,
  DAID_CHIX = 916,
  DBKD_CHIX = 917,
  DPWD_CHIX = 919,
  DTED_CHIX = 920,
  EOAND_CHIX = 921,
  MRKD_CHIX = 922,
  TKAD_CHIX = 924,
  VOW3D_CHIX = 925,
  ENELM_CHIX = 926,
  ENIM_CHIX = 927,
  FCAM_CHIX = 928,
  PIRCM_CHIX = 929,
  PSTM_CHIX = 930,
  TITM_CHIX = 931,
  UCGM_CHIX = 932,
  SANE_CHIX = 937,
  BBVAE_CHIX = 938,
  TEFE_CHIX = 939,
  AIRP_CHIX = 940,
  HEIOA_CHIX = 941,
  ORP_CHIX = 942,
  JUVEM = 958,
  MANU = 966,
  UKOUSD = 969,
  USOUSD = 971,
  EEM = 1203,
  FXI = 1204,
  IWM = 1205,
  GDX = 1206,
  XOP = 1209,
  XLK = 1210,
  XLE = 1211,
  XLU = 1212,
  IEMG = 1213,
  XLY = 1214,
  IYR = 1215,
  SQQQ = 1216,
  SMH = 1218,
  EWJ = 1219,
  XLB = 1221,
  DIA = 1222,
  TLT = 1223,
  SDS = 1224,
  EWW = 1225,
  XME = 1227,
  QID = 1229,
  ACB = 1288,
  CGC = 1289,
  CRON = 1290,
  GWPH = 1291,
  MJ = 1292,
  TLRY = 1293,
  BUD = 1294,
  LYFT = 1313,
  PINS = 1315,
  ZM = 1316,
  UBER = 1334,
  MELI = 1335,
  BYND = 1336,
  WORK = 1343,
  FDJP = 1350,
  VIAC = 1352,
  TFC = 13,
}
