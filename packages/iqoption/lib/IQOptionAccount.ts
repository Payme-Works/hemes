import { AxiosInstance } from 'axios'

import {
  Active,
  BaseIQOptionAccount,
  ExpirationPeriod,
  InstrumentType,
} from './types'
import { getActiveId } from './utils/getActiveId'
import { getFixedMilliseconds } from './utils/getFixedMilliseconds'
import { GetBalancesRequest } from './websocket/events/requests/GetBalances'
import { GetInitializationDataRequest } from './websocket/events/requests/GetInitializationData'
import { GetTopAssetsRequest } from './websocket/events/requests/GetTopAssets'
import { GetUnderlyingListRequest } from './websocket/events/requests/GetUnderlyingList'
import { GetBalancesResponse } from './websocket/events/responses/GetBalances'
import { GetInitializationDataResponse } from './websocket/events/responses/GetInitializationData'
import { GetTopAssetsResponse } from './websocket/events/responses/GetTopAssets'
import { GetUnderlyingListResponse } from './websocket/events/responses/GetUnderlyingList'
import { Profile, ProfileResponse } from './websocket/events/responses/Profile'
import { WebSocketClient } from './websocket/WebSocketClient'

export class IQOptionAccount implements BaseIQOptionAccount {
  constructor(public api: AxiosInstance, public webSocket: WebSocketClient) {}

  public async getProfile(): Promise<Profile> {
    const profileEvent = await this.webSocket.waitFor(ProfileResponse)

    if (!profileEvent) {
      throw new Error('Profile event not found')
    }

    const request = await this.webSocket.send(GetBalancesRequest)

    const balancesResponse = await this.webSocket.waitFor(GetBalancesResponse, {
      requestId: request.request_id,
    })

    if (!balancesResponse) {
      return profileEvent.msg
    }

    return {
      ...profileEvent.msg,
      balances: balancesResponse.msg,
    }
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
