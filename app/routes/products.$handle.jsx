import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {useContext, useState, useEffect} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImageGallery} from '~/components/ProductImageGallery';
import {ProductForm} from '~/components/ProductForm';
import {ProductDescription} from '~/components/ProductDescription';
import {ColorSetterContext} from '~/lib/colorContext';
/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `BADSON | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }
  if (product?.descriptionHtml) {
    // eslint-disable-next-line no-unused-vars
    const [empty, ...tabs] = product.descriptionHtml.split(
      /\<.*\s*\*\*\*[^\*]*\*\*\*\s*\<\/.*\>/,
    );
    const tabNames = [
      ...product.descriptionHtml.matchAll(/\*\*\*([^\*]*)\*\*\*/g),
    ];
    const descriptionArray = [];
    tabNames.forEach((tabName, i) => {
      descriptionArray[i] = [tabName[1], tabs[i]];
    });
    product.descriptionArray = descriptionArray;
  }
  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context, params}) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product} = useLoaderData();
  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });
  const setColorScheme = useContext(ColorSetterContext);

  useEffect(() => {
    if (product?.collections?.nodes[0].metafield) {
      setColorScheme(product.collections.nodes[0].metafield.value);
    }
  });

  const {title, images} = product;
  const titleBreakIndex = title.lastIndexOf("'") + 1;
  const [...galleryImages] = selectedVariant.metafield?.references?.nodes
    ? selectedVariant.metafield.references.nodes.map((node) => ({
        ...node.image,
        thumbnailUrl: node.previewImage.url,
      }))
    : images.nodes;

  const [variantImages, setVariantImages] = useState(galleryImages);
  return (
    <div className="product">
      <ProductImageGallery images={variantImages} />
      <div className="product-main mx-auto flex flex-col justify-center align-center text-center">
        <h1>
          {title.substring(0, titleBreakIndex)}
          <br />
          {title.substring(titleBreakIndex)}
        </h1>
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
        />
        <br />
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
          setVariantImages={setVariantImages}
        />
        <br />

        <ProductDescription description={product.descriptionArray} />
        <br />
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    currentlyNotInStock
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    metafield(namespace: "custom", key: "variant_images"){
      references(first:10){
              nodes{
                  ... on MediaImage{
                    alt
                    id

                    image{
                      height
                      width
                      url
                      id
                    }
                    previewImage{
                      url
                    }
                  }
                

              }
            }
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    collections(first: 2){
      
        nodes{
          metafield(key: "color_scheme", namespace: "custom"){
            value
          }
        }
      
    }
    images(first:10 ){
      nodes{
        url(transform:{maxWidth: 1200})
        height
        width
        altText
        id
        thumbnailUrl:url(transform:  {
           maxWidth: 400
        })
      }
    }
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
