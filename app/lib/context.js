import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {parseAcceptLanguage} from 'intl-parse-accept-language';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * @param {Request} request
 * @param {Env} env
 * @param {ExecutionContext} executionContext
 */
export async function createAppLoadContext(request, env, executionContext) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);
  let locale = {};
  const defaultLocale = {language: 'EN', country: 'US'};
  try {
    const locales = parseAcceptLanguage(request.headers.get('Accept-Language'));

    if (locales.length && locales[0].indexOf('-')) {
      locale.language = locales[0].split('-')[0].toUpperCase();
      locale.country = locales[0].split('-')[1];
    } else if (locales.length) {
      locale.language = locales[0].toUpperCase();
    }
  } catch (error) {
    console.log(error);
  }
  locale = {...defaultLocale, ...locale};
  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: locale,
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
  };
}
