import { useState } from "react";

const Dropdown: React.FC<{
  label: string;
  options: { label: string; value: string }[];
  value?: { label: string; value: string };
  onChange: (res: { label: string; value: string }) => void;
}> = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="inline-block relative">
        <button
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50"
          onClick={() => setOpen(!open)}
        >
          {label}

          {!!value ? <span>: {value.label}</span> : null}
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          >
            <path
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
        </button>

        {open ? (
          <div className="absolute w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in z-[999]">
            <div className="py-1">
              {options.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-gray-900 focus:outline-hidden"
                  onClick={() => {
                    setOpen(false);
                    onChange(item);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {open ? (
        <div
          onClick={() => setOpen(!open)}
          className="fixed left-0 top-0 w-full h-full z-[998]"
        ></div>
      ) : null}
    </>
  );
};

export default Dropdown;
