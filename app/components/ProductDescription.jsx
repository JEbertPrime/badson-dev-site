import {useState} from 'react';
export const ProductDescription = ({description}) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section aria-label='Product Description'>
    <div className="flex justify-center gap-2 m-auto">
      {description.map((tab, i) => {
        return (
          <button aria-label={'Toggle '+ tab[0]} onClick={() => setActiveTab(i)} key={tab[0]} className={`text-md uppercase ${i==activeTab ? 'text-white': 'text-gray-500'}`}>
            {tab[0]}
          </button>
        );
      })}
    </div>
    <div className='text-left max-w-screen-sm m-auto' dangerouslySetInnerHTML={{__html: description[activeTab][1]}}>
      
    </div>
    </section>
  );
};
