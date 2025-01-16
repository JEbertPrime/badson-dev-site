import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImageGallery({images}) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!images) {
    return <div className="product-image-gallery" />;
  }
  return (
    <div className="flex flex-col mb-4">
      <div className="product-image-gallery">
        {images.map((image, index) => {
          return (
            <Image
              loading="eager"
              className={`absolute m-auto left-0 right-0 transition-opacity ${
                activeSlide == index ? 'opacity-100' : 'opacity-0'
              }`}
              src={image.url}
              aspectRatio={`${image.width}/${image.height}`}
              key={image.id}
              width={image.width}
              height={image.height}
            />
          );
        })}
      </div>
      <div className="relative w-fit m-auto">
        <div
          className={`grid grid-cols-${images.length} m-auto w-fit gap-2 p-absolute left-0 right-0`}
        >
          {images.map((image, index) => {
            return (
              <button
                key={image.id + 'pip'}
                className={`w-4 h-4 border transition-colors border-[var(--color-foreground)] rounded-full `}
                onClick={() => setActiveSlide(index)}
              ></button>
            );
          })}
          <span
            className={`transition-all duration-300 w-4 h-4  bg-[var(--foreground-color)]  rounded-full absolute`}
            style={{left: activeSlide * 1.5 + 'rem'}}
          ></span>
        </div>
      </div>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
