import { AxiosInstance } from 'axios'

import {
  Active,
  allInstrumentTypes,
  BalanceMode,
  BaseIQOptionAccount,
  Candle,
  ExpirationPeriod,
  GetPositionOptions,
  InstrumentType,
  OpenBinaryOption,
  PlaceDigitalOption,
  Profile,
} from './types'
import { getActiveId } from './utils/getActiveId'
import { getFixedTimestamp } from './utils/getFixedTimestamp'
import { OpenOptionRequest } from './websocket/events/requests/binary-options/OpenOption'
import { PlaceDigitalOptionRequest } from './websocket/events/requests/digital-options/PlaceDigitalOption'
import { GetBalancesRequest } from './websocket/events/requests/GetBalances'
import { GetCandlesRequest } from './websocket/events/requests/GetCandles'
import { GetInitializationDataRequest } from './websocket/events/requests/GetInitializationData'
import { GetProfileRequest } from './websocket/events/requests/GetProfile'
import { GetTopAssetsRequest } from './websocket/events/requests/GetTopAssets'
import { GetUnderlyingListRequest } from './websocket/events/requests/GetUnderlyingList'
import { SubscribePortfolioPositionChanged } from './websocket/events/requests/SubscribePortfolioPositionChanged'
import { SubscribePositions } from './websocket/events/requests/SubscribePositions'
import { SubscribePositionsState } from './websocket/events/requests/SubscribePositionsState'
import { UnsubscribePortfolioPositionChanged } from './websocket/events/requests/UnsubscribePortfolioPositionChanged'
import { OptionResponse } from './websocket/events/responses/binary-options/Option'
import { DigitalOptionPlacedResponse } from './websocket/events/responses/digital-options/DigitalOptionPlaced'
import {
  Balance,
  GetBalancesResponse,
} from './websocket/events/responses/GetBalances'
import {
  CandlesResponse,
  GetCandlesResponse,
} from './websocket/events/responses/GetCandles'
import { GetInitializationDataResponse } from './websocket/events/responses/GetInitializationData'
import { GetProfileResponse } from './websocket/events/responses/GetProfile'
import { GetTopAssetsResponse } from './websocket/events/responses/GetTopAssets'
import { GetUnderlyingListResponse } from './websocket/events/responses/GetUnderlyingList'
import {
  Position,
  PositionChangedResponse,
} from './websocket/events/responses/PositionChanged'
import {
  PositionsStateResponse,
  PositionState,
} from './websocket/events/responses/PositionsState'
import { WebSocketClient } from './websocket/WebSocketClient'
type BalanceTypeIds = {
  [type in BalanceMode]: number
}

export const BALANCE_TYPE_IDS: BalanceTypeIds = {
  real: 1,
  practice: 4,
}

export class IQOptionAccount implements BaseIQOptionAccount {
  private activeBalance?: Balance

  private openPositionsIds: string[]

  constructor(public api: AxiosInstance, public webSocket: WebSocketClient) {
    this.openPositionsIds = []
  }

  public async getProfile(): Promise<Profile> {
    console.log('Getting profile...')

    const profileRequest = await this.webSocket.send(GetProfileRequest)

    const balancesRequest = await this.webSocket.send(GetBalancesRequest)

    const profile = await this.webSocket.waitFor(GetProfileResponse, {
      requestId: profileRequest.request_id,
    })

    if (!profile) {
      throw new Error('Profile not found')
    }

    const balances = await this.webSocket.waitFor(GetBalancesResponse, {
      requestId: balancesRequest.request_id,
    })

    if (!balances) {
      throw new Error('Cannot get balances')
    }

    const findBalance = balances.msg.find(
      balance =>
        balance.id === (this.activeBalance?.id || profile.msg.result.balance_id)
    )

    if (!findBalance) {
      throw new Error('Active balance not found')
    }

    return {
      ...profile.msg.result,
      balance: findBalance.amount,
      balance_id: findBalance.id,
      balance_type: findBalance.type,
      balances: balances.msg,
    }
  }

  public async setBalanceMode(mode: BalanceMode): Promise<void> {
    const profile = await this.getProfile()

    if (this.activeBalance?.type === BALANCE_TYPE_IDS[mode]) {
      return
    }

    const findBalance = profile.balances.find(
      balance => balance.type === BALANCE_TYPE_IDS[mode]
    )

    if (!findBalance) {
      throw new Error('Balance for mode not found')
    }

    this.activeBalance = findBalance

    const unsubscribePortfolioPositionChangedForAllInstrumentTyeps = allInstrumentTypes.map(
      instrumentType =>
        this.webSocket.send(UnsubscribePortfolioPositionChanged, {
          instrument_type: instrumentType,
          user_balance_id: profile.balance_id,
        })
    )

    await Promise.all(unsubscribePortfolioPositionChangedForAllInstrumentTyeps)

    const subscribePortfolioPositionChangedForAllInstrumentTyeps = allInstrumentTypes.map(
      instrumentType =>
        this.webSocket.send(SubscribePortfolioPositionChanged, {
          instrument_type: instrumentType,
          user_balance_id: findBalance.id,
        })
    )

    await Promise.all(subscribePortfolioPositionChangedForAllInstrumentTyeps)

    this.webSocket.send(SubscribePositionsState)
  }

  public async getActiveProfit<Type extends InstrumentType>(
    active: Active,
    instrumentType: Type,
    ...expirationPeriod: Type extends 'binary-option' ? [ExpirationPeriod] : []
  ): Promise<number> {
    const activeId = getActiveId(active)

    if (
      instrumentType === 'binary-option' ||
      instrumentType === 'turbo-option'
    ) {
      let instrument: 'binary' | 'turbo' = 'binary'

      if (
        expirationPeriod[0] === 'm1' ||
        expirationPeriod[0] === 'm5' ||
        instrumentType === 'turbo-option'
      ) {
        instrument = 'turbo'
      }

      await this.webSocket.send(GetInitializationDataRequest)

      const initializationData = await this.webSocket.waitFor(
        GetInitializationDataResponse
      )

      const activeInfo = initializationData?.msg[instrument].actives[activeId]

      if (!activeInfo) {
        throw new Error('Active info not found')
      }

      const commission = activeInfo.option.profit.commission

      return Math.round(100 - commission)
    }

    await this.webSocket.send(GetTopAssetsRequest, {
      instrument_type: instrumentType,
    })

    const topAssets = await this.webSocket.waitFor(GetTopAssetsResponse)

    if (!topAssets) {
      throw new Error('Top assets not found')
    }

    const findAsset = topAssets.msg.data.find(
      asset => asset.active_id === activeId
    )

    if (!findAsset) {
      throw new Error('Active asset not found')
    }

    return Math.round(findAsset.spot_profit.value)
  }

  public async isActiveEnabled<Type extends InstrumentType>(
    active: Active,
    instrumentType: Type,
    ...expirationPeriod: Type extends 'binary-option' ? [ExpirationPeriod] : []
  ): Promise<boolean> {
    const activeId = getActiveId(active)

    if (
      instrumentType === 'binary-option' ||
      instrumentType === 'turbo-option'
    ) {
      let instrument: 'binary' | 'turbo' = 'binary'

      if (
        expirationPeriod[0] === 'm1' ||
        expirationPeriod[0] === 'm5' ||
        instrumentType === 'turbo-option'
      ) {
        instrument = 'turbo'
      }

      await this.webSocket.send(GetInitializationDataRequest)

      const initializationData = await this.webSocket.waitFor(
        GetInitializationDataResponse
      )

      const activeInfo = initializationData?.msg[instrument].actives[activeId]

      if (!activeInfo) {
        throw new Error('Active info not found')
      }

      if (activeInfo.enabled) {
        return !activeInfo.is_suspended
      }

      return false
    }

    await this.webSocket.send(GetUnderlyingListRequest, {
      type: 'digital-option',
    })

    const underlyingList = await this.webSocket.waitFor(
      GetUnderlyingListResponse
    )

    const findAsset = underlyingList?.msg.underlying.find(
      asset => asset.active_id === activeId
    )

    if (!findAsset) {
      throw new Error('Active asset not found')
    }

    const checkIsEnabled = findAsset.schedule.some(
      item =>
        getFixedTimestamp(item.open) < Date.now() &&
        getFixedTimestamp(item.close) > Date.now()
    )

    return checkIsEnabled
  }

  private async subscribePositionState(position: Position) {
    this.openPositionsIds.push(position.id)

    this.webSocket.send(SubscribePositions, {
      positions_ids: this.openPositionsIds,
    })

    const subscribePositionInterval = setInterval(() => {
      this.webSocket.send(SubscribePositions, {
        positions_ids: this.openPositionsIds,
      })
    }, 60000)

    const positionExpiration = Number(
      position.raw_event.expiration_time ||
        position.raw_event.instrument_expiration
    )
    const positionExpirationDate = getFixedTimestamp(positionExpiration)

    const removePositionIdTimeoutMilliseconds =
      positionExpirationDate - Date.now()

    setTimeout(async () => {
      clearInterval(subscribePositionInterval)

      const closedPosition = await this.getPosition(position.id, {
        status: 'closed',
        timeout: 10000,
      })

      const openPositionIdIndex = this.openPositionsIds.indexOf(
        closedPosition.id
      )

      if (openPositionIdIndex > -1) {
        this.openPositionsIds.splice(openPositionIdIndex, 1)
      }
    }, removePositionIdTimeoutMilliseconds)
  }

  public async placeDigitalOption({
    active,
    direction,
    expiration_period,
    price,
  }: PlaceDigitalOption): Promise<Position> {
    if (!this.activeBalance) {
      throw new Error('Not found any active balance')
    }

    const placeDigitalOptionRequest = await this.webSocket.send(
      PlaceDigitalOptionRequest,
      {
        user_balance_id: this.activeBalance.id,
        active,
        direction,
        expiration_period,
        price,
      }
    )

    const placedDigitalOption = await this.webSocket.waitFor(
      DigitalOptionPlacedResponse,
      {
        requestId: placeDigitalOptionRequest.request_id,
      }
    )

    if (!placedDigitalOption) {
      throw new Error('Cannot find placed digital option')
    }

    if (placedDigitalOption.msg.message === 'active_suspended') {
      throw new Error('Could not place digital option, active is suspended')
    }

    const changedPosition = await this.webSocket.waitFor(
      PositionChangedResponse,
      {
        timeout: 10000,
        test: event =>
          event.msg.raw_event.order_ids?.includes(placedDigitalOption.msg.id) ||
          false,
      }
    )

    if (!changedPosition) {
      throw new Error(
        'Cannot find changed position while placing digital option'
      )
    }

    this.subscribePositionState(changedPosition.msg)

    return changedPosition.msg
  }

  public async openBinaryOption({
    active,
    direction,
    expiration_period,
    price,
  }: OpenBinaryOption): Promise<Position> {
    if (!this.activeBalance) {
      throw new Error('Not found any active balance')
    }

    const openOptionRequest = await this.webSocket.send(OpenOptionRequest, {
      user_balance_id: this.activeBalance.id,
      active,
      direction,
      expiration_period,
      price,
    })

    const option = await this.webSocket.waitFor(OptionResponse, {
      requestId: openOptionRequest.request_id,
    })

    if (!option) {
      throw new Error('Cannot find option')
    }

    if (
      option.msg.message ===
      'Asset is currently unavailable. Please try again in a few minutes.'
    ) {
      throw new Error('Could not open binary option, active is unavailable')
    }

    const changedPosition = await this.webSocket.waitFor(
      PositionChangedResponse,
      {
        timeout: 10000,
        test: event => event.msg.external_id === option.msg.id,
      }
    )

    if (!changedPosition) {
      throw new Error(
        'Cannot find changed position while opening binary option ' +
          new Date().toISOString()
      )
    }

    this.subscribePositionState(changedPosition.msg)

    return changedPosition.msg
  }

  public async getPosition(
    positionId: string,
    options?: GetPositionOptions
  ): Promise<Position> {
    const changedPosition = await this.webSocket.waitFor(
      PositionChangedResponse,
      {
        timeout: options?.timeout,
        test: event => {
          if (options?.status && event.msg.status !== options.status) {
            return false
          }

          return event.msg.id === positionId
        },
      }
    )

    if (!changedPosition) {
      throw new Error('Cannot find changed position')
    }

    return changedPosition.msg
  }

  public async getPositionState(positionId: string): Promise<PositionState> {
    const positionsState = await this.webSocket.waitFor(
      PositionsStateResponse,
      {
        test: event => {
          return event.msg.positions.some(
            positionState => positionState.id === positionId
          )
        },
      }
    )

    if (!positionsState) {
      throw new Error('Cannot find any positions state')
    }

    const findPositionStateById = positionsState.msg.positions.find(
      positionState => positionState.id === positionId
    )

    if (!findPositionStateById) {
      throw new Error('Cannot find position state')
    }

    return findPositionStateById
  }

  public async getCandles(
    active: Active,
    expirationPeriod: ExpirationPeriod,
    count: number,
    toDate?: Date | number
  ): Promise<Candle[]> {
    const getCandlesRequest = await this.webSocket.send(GetCandlesRequest, {
      active,
      timePeriod: expirationPeriod,
      count,
      toDate: toDate || Date.now(),
    })

    const getCandlesResponse = await this.webSocket.waitFor<CandlesResponse>(
      GetCandlesResponse,
      {
        requestId: getCandlesRequest.request_id,
      }
    )

    if (!getCandlesResponse) {
      throw new Error('Candles not found')
    }

    return getCandlesResponse.msg.candles
  }
}
