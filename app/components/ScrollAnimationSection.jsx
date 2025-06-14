import {useEffect, useState, useRef, useContext} from 'react';
import {ColorSetterContext} from '~/lib/colorContext';
export const ScrollAnimationSection = (props) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const topLevelDivRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState('down');
  const setColorScheme = useContext(ColorSetterContext);
  const scrollCallback = props.setScroll || (() => {});
  useEffect(() => {
    const handleScroll = () => {
      if (topLevelDivRef.current) {
        const rect = topLevelDivRef.current.getBoundingClientRect();
        const totalHeight = rect.height;
        const scrolledHeight = Math.max(0, window.innerHeight - rect.top);

        // Calculate the percentage of the element scrolled through
        const percentage = Math.max(0, (scrolledHeight / totalHeight) * 100);
        if (percentage >= 125) {
          setColorScheme('light');
        } else {
          setColorScheme('dark');
        }

        setScrollProgress(percentage);
        scrollCallback(percentage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.dispatchEvent(new Event('scroll'));
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={topLevelDivRef}
      className="h-[80dvh] bg-[var(--background-color)] relative"
    >
      <div className="bg mb-[-1px] p-2 pt-8 sticky top-[40dvh]">
        <div
          className={
            ' w-fit m-auto text-black text-3xl p-2 pb-1 block duration-300 transition-opacity' +
            ((scrollProgress > 33) & (scrollProgress < 125)
              ? ' animate-pulse'
              : '')
          }
        >
          <CoreDots scrollProgress={scrollProgress} />
        </div>
      </div>
    </div>
  );
};
const CoreDots = ({scrollProgress}) => {
  const letters = [
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  ];
  return (
    <div
      onClick={() =>
        document.querySelector('#core').scrollIntoView({behavior: 'smooth'})
      }
      className="flex flex-row justify-center gap-6"
    >
      {letters.map((letter, index) => (
        <DotLetter
          key={index}
          scrollProgress={scrollProgress}
          letter={letter}
          index={index}
        />
      ))}
    </div>
  );
};
const DotLetter = ({letter, scrollProgress, index}) => {
  return (
    <span
      className={
        'grid cursor-pointer  grid-cols-5 gap-1 overflow-visible w-max transition-transform duration-300 ' +
        (scrollProgress < 150 ? 'rotate-180' : 'rotate-360 delay-200')
      }
      style={
        scrollProgress > 125
          ? {}
          : {
              transform: `translateX(calc(${50 - index * 142}% + 5.75rem))`,
            }
      }
    >
      {letter.map((square, i) => (
        <span
          key={i}
          className={`w-2 transition-opacity duration-500 h-2 rounded-full bg-[var(--foreground-color)] ${
            square
              ? 'opacity-100'
              : scrollProgress < 150
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        ></span>
      ))}
    </span>
  );
};
