"user client";

import { useState, useEffect } from "react";

const Dialog = ({ show, onClose, children, title }) => {
  // State to handle outside click
  const [isShown, setIsShown] = useState(show);

  useEffect(() => {
    setIsShown(show);
  }, [show]);

  if (!isShown) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mt-2 text-gray-500">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
