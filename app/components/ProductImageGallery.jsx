import {Image} from '@shopify/hydrogen';
import {useEffect, useState, useRef} from 'react';
import {useSwipeable} from 'react-swipeable';
/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImageGallery({images, navigationType = 'thumbnails'}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [galleryHeight, setGalleryHeight] = useState(400);
  const imageRefs = useRef([]);
  const aspectRatio = `${images[0].width}/${images[0].height}`;
  let secondRowThumbs = [];
  if (true) {
    secondRowThumbs = images.filter((image) => image.altText == 'model');
  }
  const handlers = useSwipeable({
    onSwipedRight: () =>
      setActiveSlide(activeSlide - 1 < 0 ? images.length - 1 : activeSlide - 1),
    onSwipedLeft: () => setActiveSlide((activeSlide + 1) % images.length),
  });
  useEffect(() => {
    setGalleryHeight(imageRefs.current[activeSlide]?.clientHeight);
    console.log(imageRefs.current[activeSlide]);
    const handleResize = () =>
      setGalleryHeight(imageRefs.current[activeSlide]?.clientHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSlide, images]);
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
    <div className="flex flex-col mb-4 w-full">
      <div
        className="product-image-gallery touch-pan-y mb-2 "
        style={{height: galleryHeight}}
        {...handlers}
      >
        {images.map((image, index) => {
          return (
            <Image
              ref={(el) => (imageRefs.current[index] = el)}
              loading="eager"
              className={`absolute object-contain m-auto w-full h-auto left-0 right-0 transition-opacity ${
                activeSlide == index ? 'opacity-100' : 'opacity-0'
              }`}
              src={image.url}
              aspectRatio={aspectRatio}
              key={image.id}
              width={image.width}
              height={image.height}
            />
          );
        })}
      </div>
      {navigationType == 'thumbnails' ? (
        <>
          <div className="h-24 flex justify-between w-fit gap-2 m-auto">
            {images.map((image, index) => {
              if (image.altText != 'model')
                return (
                  <Image
                    key={image.id + '-thumb'}
                    width={400}
                    src={image.thumbnailUrl}
                    className="h-full w-auto"
                    onClick={() => setActiveSlide(index)}
                  />
                );
            })}
          </div>
          {secondRowThumbs.length && (
            <div className="h-24 mt-4 flex justify-between w-fit gap-2 m-auto">
              {images.map((image, index) => {
                if (image.altText == 'model')
                  return (
                    <Image
                      key={image.id + '-thumb'}
                      width={400}
                      src={image.thumbnailUrl}
                      className="h-full w-auto"
                      onClick={() => setActiveSlide(index)}
                    />
                  );
              })}
            </div>
          )}
        </>
      ) : (
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
      )}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
