import {useEffect, useState, useRef} from 'react';
function isNumeric(str) {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export const ProductDescription = ({description}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [minHeight, setMinHeight] = useState(0);
  const [isInches, setUnit] = useState(true);
  let [cmValues, setCmValues] = useState([]);
  let [inchesValues, setInchesValues] = useState([]);
  const descriptionDiv = useRef(null);
  useEffect(() => {
    if (activeTab == 1) {
      let unit = document.querySelector('table tr:first-child td:first-child');
      if (!unit) return;

      unit.style.cursor = 'pointer';
      unit.style.textAlign = 'center';
      unit.innerHTML = isInches
        ? "<span class='underline font-bold'><span class='text-green-600'>IN</span> / CM</span>"
        : "<span class='underline font-bold'>IN / <span class='text-green-600'>CM</span></span>";
    }
  }, [activeTab, isInches]);
  useEffect(() => {
    if (minHeight < descriptionDiv.current.clientHeight) {
      setMinHeight(descriptionDiv.current.clientHeight);
    }
    if (activeTab == 1) {
      let unit = document.querySelector('table tr:first-child td:first-child');
      if (!unit) return;
      unit.style.cursor = 'pointer';
      unit.style.textAlign = 'center';

      let measurements = Array.from(
        document.querySelectorAll('table td'),
      ).filter((td) => isNumeric(td.innerText));
      const toggleUnit = () => {
        setUnit((i) => !i);
      };
      let inValues, cmVals;
      if (!inchesValues.length) {
        inValues = measurements.map((td) => td.innerText);
        setInchesValues(inValues);
        cmVals = measurements.map((td) =>
          Math.trunc(Number(td.innerText) * 2.54),
        );
        setCmValues(cmVals);
      } else {
        inValues = inchesValues;
        cmVals = cmValues;
      }
      const unitListener = (e) => {
        toggleUnit();
        unit.innerHTML = isInches
          ? "<span class='underline font-bold'><span class='text-green-600'>IN</span> / CM</span>"
          : "<span class='underline font-bold'>IN / <span class='text-green-600'>CM</span></span>";
        measurements.forEach(
          (m, i) => (m.innerText = !isInches ? inValues[i] : cmVals[i]),
        );
      };
      unit.addEventListener('click', unitListener);
      return () => unit.removeEventListener('click', unitListener);
    }
  }, [activeTab, isInches, minHeight]);
  return (
    <section aria-label="Product Description" className="product-description ">
      <div className="flex justify-center gap-6 m-auto">
        {description.map((tab, i) => {
          return (
            <button
              aria-label={'Toggle ' + tab[0]}
              onClick={() => setActiveTab(i)}
              key={tab[0]}
              className={`text-md uppercase ${
                i == activeTab
                  ? 'text-[var(--foreground-color)]'
                  : 'text-[rgba(var(--foreground-color-rgb),.7)]'
              }`}
            >
              {tab[0]}
            </button>
          );
        })}
      </div>
      <div
        ref={descriptionDiv}
        className="text-left max-w-screen-sm m-auto mt-4 p-4"
        style={{minHeight: minHeight + 'px'}}
        dangerouslySetInnerHTML={{__html: description[activeTab][1]}}
      ></div>
    </section>
  );
};
