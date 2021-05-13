import { Response } from '../Response'

interface ProfileResult {
  account_status: string
  address: string
  auth_two_factor: any
  avatar: string
  balance: number
  balance_id: number
  balance_type: number
  balances: never[]
  birthdate: number
  bonus_total_wager: number
  bonus_wager: number
  cashback_level_info: {
    enabled: boolean
  }
  city: string
  client_category_id: number
  company_id: number
  confirmation_required: number
  confirmed_phones: never[]
  country_id: number
  created: number
  currency: string
  currency_char: string
  currency_id: number
  demo: number
  deposit_count: number
  deposit_in_one_click: boolean
  email: string
  finance_state: string
  first_name: string
  flag: string
  forget_status: {
    status: string
    created: any
    expires: any
  }
  functions: never[]
  gender: string
  group_id: number
  id: number
  infeed: number
  is_activated: boolean
  is_islamic: boolean
  is_vip_group: boolean
  kyc: {
    status: number
    isPhoneFilled: boolean
    isPhoneNeeded: boolean
    isProfileFilled: boolean
    isProfileNeeded: boolean
    isRegulatedUser: boolean
    daysLeftToVerify: number
    isPhoneConfirmed: boolean
    isDocumentsNeeded: boolean
    isDocumentsApproved: boolean
    isDocumentsDeclined: boolean
    isDocumentsUploaded: boolean
    isDocumentPoaUploaded: boolean
    isDocumentPoiUploaded: boolean
    isDocumentsUploadSkipped: boolean
    isPhoneConfirmationSkipped: boolean
  }
  kyc_confirmed: boolean
  last_name: string
  last_visit: boolean
  locale: string
  mask: string
  messages: number
  money: {
    deposit: {
      min: number
      max: number
    }
    withdraw: {
      min: number
      max: number
    }
  }
  name: string
  nationality: string
  need_phone_confirmation: boolean
  new_email: string
  nickname: string
  personal_data_policy: {
    is_call_accepted: {
      status: boolean
    }
    is_push_accepted: {
      status: boolean
    }
    is_email_accepted: {
      status: boolean
    }
    is_agreement_accepted: {
      status: boolean
    }
    is_thirdparty_accepted: {
      status: boolean
    }
  }
  phone: string
  popup: never[]
  postal_index: string
  public: number
  rate_in_one_click: boolean
  site_id: number
  skey: string
  socials: any
  ssid: boolean
  tc: boolean
  timediff: number
  tin: string
  tournaments_ids: any
  trade_restricted: boolean
  trial: boolean
  tz: string
  tz_offset: number
  user_circle: any
  user_group: string
  user_id: number
  welcome_splash: number
}

interface ProfileResponse {
  isSuccessful: boolean
  message: never[]
  result: ProfileResult
}

export class GetProfileResponse extends Response<ProfileResponse> {
  public get name(): string {
    return 'profile'
  }
}
