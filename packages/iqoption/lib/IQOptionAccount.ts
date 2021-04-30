import { AxiosInstance } from 'axios'

import {
  Active,
  allInstrumentTypes,
  BalanceMode,
  BaseIQOptionAccount,
  ExpirationPeriod,
  InstrumentType,
  Profile,
} from './types'
import { getActiveId } from './utils/getActiveId'
import { getFixedMilliseconds } from './utils/getFixedMilliseconds'
import { GetBalancesRequest } from './websocket/events/requests/GetBalances'
import { GetInitializationDataRequest } from './websocket/events/requests/GetInitializationData'
import { GetProfileRequest } from './websocket/events/requests/GetProfile'
import { GetTopAssetsRequest } from './websocket/events/requests/GetTopAssets'
import { GetUnderlyingListRequest } from './websocket/events/requests/GetUnderlyingList'
import { SubscribePortfolioPositionChanged } from './websocket/events/requests/SubscribePortfolioPositionChanged'
import { UnsubscribePortfolioPositionChanged } from './websocket/events/requests/UnsubscribePortfolioPositionChanged'
import {
  Balance,
  GetBalancesResponse,
} from './websocket/events/responses/GetBalances'
import { GetInitializationDataResponse } from './websocket/events/responses/GetInitializationData'
import { GetProfileResponse } from './websocket/events/responses/GetProfile'
import { GetTopAssetsResponse } from './websocket/events/responses/GetTopAssets'
import { GetUnderlyingListResponse } from './websocket/events/responses/GetUnderlyingList'
import { WebSocketClient } from './websocket/WebSocketClient'

type BalanceTypeIds = {
  [type in BalanceMode]: number
}

const balanceTypeIds: BalanceTypeIds = {
  real: 1,
  practice: 4,
}

export class IQOptionAccount implements BaseIQOptionAccount {
  private activeBalance?: Balance

  constructor(public api: AxiosInstance, public webSocket: WebSocketClient) {}

  public async getProfile(): Promise<Profile> {
    const profileRequest = await this.webSocket.send(GetProfileRequest)

    const balancesRequest = await this.webSocket.send(GetBalancesRequest)

    const profileResponse = await this.webSocket.waitFor(GetProfileResponse, {
      requestId: profileRequest.request_id,
    })

    if (!profileResponse) {
      throw new Error('Profile not found')
    }

    const balancesResponse = await this.webSocket.waitFor(GetBalancesResponse, {
      requestId: balancesRequest.request_id,
    })

    if (!balancesResponse) {
      throw new Error('Cannot get balances')
    }

    const findBalance = balancesResponse.msg.find(
      balance =>
        balance.id ===
        (this.activeBalance?.id || profileResponse.msg.result.balance_id)
    )

    if (!findBalance) {
      throw new Error('Active balance not found')
    }

    return {
      ...profileResponse.msg.result,
      balance: findBalance.amount,
      balance_id: findBalance.id,
      balance_type: findBalance.type,
      balances: balancesResponse.msg,
    }
  }

  public async setBalanceMode(mode: BalanceMode): Promise<void> {
    const profile = await this.getProfile()

    if (this.activeBalance?.type === balanceTypeIds[mode]) {
      return
    }

    const findBalance = profile.balances.find(
      balance => balance.type === balanceTypeIds[mode]
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

      if (expirationPeriod[0] === 'm1' || instrumentType === 'turbo-option') {
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

      if (expirationPeriod[0] === 'm1' || instrumentType === 'turbo-option') {
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
        getFixedMilliseconds(item.open) < Date.now() &&
        getFixedMilliseconds(item.close) > Date.now()
    )

    return checkIsEnabled
  }
}
