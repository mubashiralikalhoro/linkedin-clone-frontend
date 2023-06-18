import React, { useRef, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";

// props format {id,name}

const MultiSelection = ({
  onAdd = () => {},
  error,
  onChange = () => {},
  searchPlaceholder = "Search name",
  onRemove,
  placeholder = "Select",
  label = "Select",
  value = [],
  required,
  options = [
    { id: 1, name: "option 1" },
    { id: 1, name: "option 2" },
  ],
  disabled = false,
  className,
}) => {
  const searchBar = useRef();
  const [show, setShow] = useState(false);
  return (
    <div className={`${className}`}>
      <div className="relative w-full mb-3">
        <label className="uppercase text-xs font-bold mb-2 flex " htmlFor="grid-password">
          {label}
          {required ? " (" : ""}
          <div className="text-red-500">{required ? "*" : ""}</div>
          {required ? ")" : ""}
        </label>
        <div className="w-full flex flex-wrap space-x-1 mb-1">
          {value.length ? (
            value.map((item, index) => (
              <div className="bg-slate-700 p-1 w-fit rounded text-white mb-1 flex items-center" key={index}>
                <h1>{item.name}</h1>
                {!disabled && (
                  <div
                    className="rounded-full ml-2 flex items-start justify-center text-[10px] cursor-pointer hover:bg-white hover:text-black"
                    onClick={() => onRemove(item)}
                  >
                    <RxCrossCircled className="text-lg" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              {disabled && (
                <div className=" p-1 rounded text-slate-600 mb-1 flex items-center justify-between w-full">
                  <h1>-</h1>
                </div>
              )}
            </>
          )}
        </div>
        {!disabled && (
          <div>
            <input
              onChange={onChange}
              type="text"
              ref={searchBar}
              onFocus={() => {
                setShow(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShow(false);
                }, 200);
              }}
              className={`${
                error?.length > 0 ? "border-red-500" : "border-slate-300 "
              } px-3 py-3 placeholder-slate-500 text-white focus:border-blue-500
               bg-slate-800 rounded text-sm border-[1px] focus:outline-none w-full  ${show ? "rounded-t" : "rounded"}`}
              placeholder={searchPlaceholder}
            />
          </div>
        )}
        {show && (
          <div className="bg-slate-800 border absolute w-full z-50 shadow max-h-36 overflow-scroll">
            {options?.filter((item) => !value.find((i) => i.id === item.id))?.length ? (
              options
                // rendering only options which are not selected
                .filter((item) => !value.find((i) => i.id === item.id))
                .map((item, index) => (
                  <div key={index}>
                    {index !== 0 && <hr />}
                    <div
                      className="p-1 hover:bg-blue-500 cursor-pointer"
                      onClick={() => {
                        onAdd(item);
                        //searchBar.current.focus();
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                ))
            ) : (
              <div>
                <div className="p-1  rounded flex justify-center">no results</div>
              </div>
            )}
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        {/* </select> */}
      </div>
    </div>
  );
};

export default MultiSelection;
