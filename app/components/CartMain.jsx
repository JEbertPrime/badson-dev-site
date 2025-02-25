import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary, CartCheckoutActions} from './CartSummary';

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity > 0;

  return (
    <div
      className={
        className +
        'w-full px-8 mt-10  max-w-screen-xl m-auto flex md:flex-row flex-col gap-4 justify-center'
      }
    >
      {linesCount && (
        <div className="md:w-2/3  md:order-1 order-2">
          <div className="w-full flex justify-between">
            <p className="text-sm">Shopping Bag</p>
            <p className="text-sm">Total</p>
          </div>
          <hr className=" border-b-2 border-foreground w-full mt-4 mb-2" />
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
          <hr className=" border-b-2 border-foreground w-full mt-4 mb-4" />

          <CartSummary cart={cart} layout={layout} />
          <hr className=" border-b-2 border-foreground w-full mt-4 mb-4" />
        </div>
      )}

      <CartEmpty hidden={linesCount} layout={layout} />
      {linesCount && (
        <div className="cart-details md:order-2 order-1 flex flex-col justify-start md:w-1/3 md:p-3">
          <div aria-labelledby="cart-lines"></div>
          {cartHasItems && (
            <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({hidden = false}) {
  const {close} = useAside();
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link>
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
