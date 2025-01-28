import {useEffect, useState, useRef} from 'react';
export const ProductDescription = ({description}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [minHeight, setMinHeight] = useState(0);
  const descriptionDiv = useRef(null);
  useEffect(() => {
    if (minHeight < descriptionDiv.current.clientHeight)
      setMinHeight(descriptionDiv.current.clientHeight);
  }, [activeTab]);
  return (
    <section aria-label="Product Description">
      <div className="flex justify-center gap-2 m-auto">
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
        className="text-left max-w-screen-sm m-auto"
        style={{minHeight: minHeight + 'px'}}
        dangerouslySetInnerHTML={{__html: description[activeTab][1]}}
      ></div>
    </section>
  );
};
