import { useShippingProviderFactory, UseShippingProviderParams, Context } from '@vue-storefront/core';
import type { ShippingProvider, ShippingMethod } from '@vue-storefront/prestashop-api';

const params: UseShippingProviderParams<ShippingProvider, ShippingMethod> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context, { customQuery }) => {
    const vsfCookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
    const vsfCookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

    const psCookieKey = context.$prestashop.config.app.$cookies.get(vsfCookieKey);
    const psCookieValue = context.$prestashop.config.app.$cookies.get(vsfCookieValue);

    const lang = context.$prestashop.config.app.$cookies.get('vsf-locale');
    const { data, cookieObject } = await context.$prestashop.api.getShippingMethods({ psCookieKey, psCookieValue, lang: lang });
    if (data.code === 200) {
      if (cookieObject) {
        context.$prestashop.config.app.$cookies.set(vsfCookieKey, cookieObject.vsfPsKeyCookie);
        context.$prestashop.config.app.$cookies.set(vsfCookieValue, cookieObject.vsfPsValCookie);
      }
      return data.psdata;
    } else {
      // add to cart failed
      return {};
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  save: async (context: Context, params) => {
    const vsfCookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
    const vsfCookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

    const psCookieKey = context.$prestashop.config.app.$cookies.get(vsfCookieKey);
    const psCookieValue = context.$prestashop.config.app.$cookies.get(vsfCookieValue);

    const lang = context.$prestashop.config.app.$cookies.get('vsf-locale');
    await context.$prestashop.api.setShippingMethod({ ...params, psCookieKey, psCookieValue, lang: lang });

    const { data, cookieObject } = await context.$prestashop.api.getShippingMethods({ psCookieKey, psCookieValue, lang: lang });
    if (data.code === 200) {
      if (cookieObject) {
        context.$prestashop.config.app.$cookies.set(vsfCookieKey, cookieObject.vsfPsKeyCookie);
        context.$prestashop.config.app.$cookies.set(vsfCookieValue, cookieObject.vsfPsValCookie);
      }
      return data.psdata;
    } else {
      // add to cart failed
      return {};
    }
  }
};

export const useShippingProvider = useShippingProviderFactory<ShippingProvider, ShippingMethod>(params);
