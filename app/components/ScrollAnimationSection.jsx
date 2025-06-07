import {useEffect, useState, useRef, useContext} from 'react';
import {ColorSetterContext} from '~/lib/colorContext';
export const ScrollAnimationSection = (props) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const topLevelDivRef = useRef(null);
  const setColorScheme = useContext(ColorSetterContext);
  const scrollCallback = props.setScroll || (() => {});
  useEffect(() => {
    const handleScroll = () => {
      if (topLevelDivRef.current) {
        const rect = topLevelDivRef.current.getBoundingClientRect();
        const totalHeight = rect.height;
        const scrolledHeight = Math.max(0, window.innerHeight - rect.top);

        // Calculate the percentage of the element scrolled through
        const percentage = Math.max(
          0,
          Math.min(100, (scrolledHeight / totalHeight) * 100),
        );
        if (percentage >= 66) {
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
      className="h-[150dvh] bg-[var(--background-color)] relative"
    >
      <div className="bg mb-[-1px] p-2 pt-8 sticky top-[40dvh]">
        <div className="border border-black w-fit m-auto text-black text-3xl p-2 pb-1 block">
          <h2>CORE</h2>
        </div>
      </div>
    </div>
  );
};
