const CustomInput = ({ id, text,  className = "", value, setValue }) => {
  return (
    <div
      className={`container text-xl items-center font-medium mb-6 flex gap-x-2 ${className} w-full mx-auto`}
    >
      <label htmlFor={id}>{text}</label>
      <input
        id={id}
        className="relative border rounded-full p-2 border-gray-700 ml-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter URL to scrape"
      />
    </div>
  );
};

export default CustomInput;
