import {Link, useNavigate} from '@remix-run/react';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({
  productOptions,
  selectedVariant,
  setVariantImages,
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="product-form m-auto">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5 className="hidden">{option.name}</h5>
            <div
              className={`product-options-grid  m-auto grid grid-flow-col auto-cols-min w-fit`}
            >
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;
                const variantImages = value.metafield?.references?.nodes.map(
                  (node) => ({
                    ...node.image,
                    thumbnailUrl: node.previewImage.url,
                  }),
                );

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className={`product-options-item border aspect-square  ${
                        selected
                          ? 'after:w-full after:h-full after:border-green-500 after:border'
                          : ''
                      } border-[var(--color-foreground)] rounded-full`}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        opacity: available ? 1 : 0.3,
                      }}
                      onClick={() => {
                        if (!selected && variantImages) {
                          setVariantImages(variantImages);
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`relative flex-grow basis-1 ${
                        swatch ? '' : 'p-2 pt-3'
                      } border border-[var(--color-foreground)] h-full w-auto rounded-full aspect-square product-options-item${
                        exists && !selected ? ' link' : ''
                      } ${
                        selected
                          ? `${
                              swatch
                                ? 'after:w-[100%] after:h-[100%]'
                                : 'after:w-[90%] after:h-[90%]'
                            } after:border-[#98cd78] after:border-2 after:left-0 after:right-0 after:m-auto after:bottom-0 after:top-0 after:rounded-full after:block after:absolute`
                          : ''
                      }`}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          if (variantImages) {
                            setVariantImages(variantImages);
                          }

                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
            <br />
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                  attributes: [
                    {
                      key: 'Pre-order',
                      value: true,
                    },
                  ],
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? (
          selectedVariant.currentlyNotInStock ? (
            <span>
              Pre
              <br />
              Order
            </span>
          ) : (
            'Add'
          )
        ) : (
          <>
            Sold
            <br /> Out
          </>
        )}
      </AddToCartButton>
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch aspect-square w-9 rounded-full"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} className="rounded-full" alt={name} />}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
