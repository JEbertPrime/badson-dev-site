import {CartForm} from '@shopify/hydrogen';

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}) {
  return (
    <CartForm
      route="/cart"
      inputs={{lines}}
      action={CartForm.ACTIONS.LinesAdd}
      fetcherKey="add-fetcher"
    >
      {(fetcher) => {
        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              className="rounded-full disabled:opacity-50 relative w-20 aspect-square border border-[var(--foreground-color)] text-center pt-1 uppercase hover:after:w-[90%] hover:after:h-[90%] hover:after:border-[#98cd78] hover:after:border-2 hover:after:left-0 hover:after:right-0 hover:after:m-auto hover:after:bottom-0 hover:after:top-0 hover:after:rounded-full hover:after:block hover:after:absolute"
              disabled={disabled || fetcher.state == 'submitting'}
            >
              {children}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}

/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
