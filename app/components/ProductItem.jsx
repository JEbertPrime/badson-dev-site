import {Link} from '@remix-run/react';
import {useVariantUrl} from '~/lib/variants';
import {Image, Money} from '@shopify/hydrogen';
/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export const ProductItem = ({product, loading, className}) => {
  const variantUrl = useVariantUrl(product.handle);
  const colorOption = product?.options?.find(
    (option) => option.name == 'Color',
  );
  return (
    <Link
      className={
        'product-item hover:no-underline flex flex-col last-of-type:w-3/5 last-of-type:m-auto h-full group  ' +
        className
      }
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          data={product.featuredImage}
          loading={loading}
          width={300}
          className="m-auto"
        />
      )}
      <div className=" text-center mt-2 text-sm">
        <h4 className="text-xs ">{product.title}</h4>
        <small className="text-xs ">
          <Money data={product.priceRange.minVariantPrice} />
        </small>
        <div className="flex mt-2 mb-2 w-full gap-2 justify-center">
          {colorOption?.optionValues.map((value) => (
            <span
              key={value.id}
              className="w-4 h-4 rounded-full border border-foreground block"
              style={{backgroundColor: value.swatch.color}}
            ></span>
          ))}
        </div>
      </div>
      <hr className="w-0  border-gray-400 transition-all m-auto mb-0" />
    </Link>
  );
};
