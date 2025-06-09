export const DownArrow = () => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div></div>
      <span
        className={`w-2 transition-opacity duration-300 h-2 rounded-full bg-white animate-pulse  `}
      ></span>
      <div></div>
      <div></div>
      <span
        className={`w-2 transition-opacity duration-300 h-2 rounded-full bg-white animate-pulse animation-delay-[100ms]`}
      ></span>
      <div></div>
      <span
        className={`w-2 transition-opacity duration-300 h-2 rounded-full bg-white animate-pulse animation-delay-[200ms]`}
      ></span>
      <span
        className={`w-2 transition-opacity duration-300 h-2 rounded-full bg-white  animate-pulse animation-delay-[200ms]`}
      ></span>
      <span
        className={`w-2 transition-opacity duration-300 h-2 rounded-full bg-white animate-pulse animation-delay-[200ms]`}
      ></span>
      <div></div>
      <span
        className={`w-2 transition-opacity duration-300 h-2 rounded-full bg-white animate-pulse animation-delay-[300ms]`}
      ></span>
      <div></div>
    </div>
  );
};
