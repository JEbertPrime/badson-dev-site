import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import {useSwipeable} from 'react-swipeable';
/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImageGallery({images}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const handlers = useSwipeable({
    onSwipedRight: () =>
      setActiveSlide(activeSlide - 1 < 0 ? images.length - 1 : activeSlide - 1),
    onSwipedLeft: () => setActiveSlide((activeSlide + 1) % images.length),
  });
  const gridClasses = {
    0: 'grid-cols-0',
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };
  if (!images) {
    return <div className="product-image-gallery" />;
  }
  return (
    <div className="flex flex-col mb-4">
      <div className="product-image-gallery touch-pan-y" {...handlers}>
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
          className={`grid ${
            gridClasses[images.length]
          } m-auto w-fit gap-2 p-absolute left-0 right-0`}
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
