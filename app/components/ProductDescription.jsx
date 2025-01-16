import {useState} from 'react';
export const ProductDescription = ({description}) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="flex justify-center m-auto">
      {description.map((tab, i) => {
        return (
          <button onClick={() => setActiveTab(i)} key={tab[0]}>
            {tab[0]}
          </button>
        );
      })}
    </div>
  );
};
