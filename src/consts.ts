import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, Provider } from '@angular/core';
import { i18nEn, i18nRu, JunteUiModule, localeEnUs as jntEnUs, localeRu as jntRu } from '@junte/ui';
import { Locale } from 'date-fns';
import { enUS as dfnsEnUS, ru as dfnsRu } from 'date-fns/locale';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { detectLanguage } from 'src/utils/lang';
import { Language } from './enums/language';

export const LANGUAGE_CHANGE_REGEX = /^\/(ru|en)\//;
export const BASE_URI = 'https://www.specprojector.com';
export const CLOUD_PAYMENT_KEY = 'pk_7cebed1a56517f44b949ad8651ce2';
export const CLOUD_PAYMENT_SKIN = 'modern';
export const PAYMENT_CURRENCY = 'RUB';
export const CLOUD_PAYMENT_RECURRENT_INTERVAL = 'Month';
export const CLOUD_PAYMENT_RECURRENT_PERIOD = 1;
export const UI_DELAY = 250;
export const SCHEME_VERSION = 2;
export const PLATFORM_DELAY = 100;
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_TIME_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ss';
export const BUILD_HASH = 'v18';
export const CURRENT_LANGUAGE = detectLanguage();

enum CurrencyCode {
  usd = 'usd',
  rur = 'rur'
}

export const BACKEND: {
  config: {
    currencyCode: CurrencyCode,
    firstWeekDay: 0 | 1
  }
} = window['backend'] || {
  config: {
    currencyCode: CurrencyCode.usd,
    firstWeekDay: 1
  }
};

const CURRENCY_CODE = BACKEND.config.currencyCode;
export const FIRST_DAY_OF_WEEK: 0 | 1 = BACKEND.config.firstWeekDay;

const fnsConfig = new DateFnsConfigurationService();

enum LocaleData {
  NumberFormats = 14,
  CurrencyCode = 16
}

function getLocaleData(locale: Object) {
  let changes;
  switch (CURRENCY_CODE) {
    case CurrencyCode.rur:
      changes = {
        [LocaleData.NumberFormats]: localeRu[LocaleData.NumberFormats],
        [LocaleData.CurrencyCode]: localeRu[LocaleData.CurrencyCode]
      };
      break;
    case CurrencyCode.usd:
    default:
      changes = {
        [LocaleData.NumberFormats]: localeEn[LocaleData.NumberFormats],
        [LocaleData.CurrencyCode]: localeEn[LocaleData.CurrencyCode]
      };

  }
  return {...locale, ...changes};
}

function mergeDfnsLocale(l: Locale): Locale {
  return {...l, ...{options: {weekStartsOn: FIRST_DAY_OF_WEEK}}};
}

export let APP_PROVIDERS: Provider[] = [
  {
    provide: Language,
    useValue: CURRENT_LANGUAGE
  },
  {
    provide: DateFnsConfigurationService,
    useValue: fnsConfig
  },
];

let data;
let dfnsLocale;
export let config;
switch (CURRENT_LANGUAGE) {
  case Language.ru:
    data = getLocaleData(localeRu);
    registerLocaleData(data);
    dfnsLocale = mergeDfnsLocale(dfnsRu);
    fnsConfig.setLocale(dfnsLocale);
    config = {
      i18n: i18nRu,
      hash: BUILD_HASH,
      weekStartsOn: FIRST_DAY_OF_WEEK,
      locale: {
        ui: jntRu,
        dfns: dfnsLocale
      }
    };
    APP_PROVIDERS.push({
      provide: LOCALE_ID,
      useValue: 'ru'
    });
    break;
  case Language.en:
  default:
    data = getLocaleData(localeEn);
    registerLocaleData(data);
    dfnsLocale = mergeDfnsLocale(dfnsEnUS);
    fnsConfig.setLocale(dfnsLocale);
    config = {
      i18n: i18nEn,
      hash: BUILD_HASH,
      weekStartsOn: FIRST_DAY_OF_WEEK,
      locale: {
        ui: jntEnUs,
        dfns: dfnsLocale
      }
    };
    APP_PROVIDERS.push({
      provide: LOCALE_ID,
      useValue: 'en'
    });
}

export const DFNS_LOCALE = dfnsLocale;
export const DFNS_OPTIONS = {locale: DFNS_LOCALE, weekStartsOn: FIRST_DAY_OF_WEEK};

APP_PROVIDERS.push({
  provide: DEFAULT_CURRENCY_CODE,
  useValue: data[LocaleData.CurrencyCode]
});

APP_PROVIDERS = APP_PROVIDERS.concat(JunteUiModule.forRoot(config).providers);

export const LOCAL_MODE = (href => {
  // href = 'http://localhost';
  const regex = /(localhost|127.0.0.1)/ig;
  return regex.test(href);
})(window.location.href);
