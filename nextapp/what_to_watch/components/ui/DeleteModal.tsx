export default function DeleteModal({
  message,
  onConfirm,
  onClose,
}: {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div
        id="popup-modal"
        tabIndex={-1}
        className="overflow-y-auto overflow-x-hidden w-fit max-h-full bg-gray-900 rounded-2xl"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            <button
              type="button"
              className="absolute top-3 inset-e-2.5 text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
              data-modal-hide="popup-modal"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-fg-disabled w-12 h-12"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-6 text-body">{message}</h3>
              <div className="flex items-center space-x-4 justify-center">
                <button
                  data-modal-hide="popup-modal"
                  onClick={onConfirm}
                  type="button"
                  className="text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  Yes, I'm sure
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={onClose}
                  className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
