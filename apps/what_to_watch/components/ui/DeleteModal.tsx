import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

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
      <Dialog
        open={true}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => onClose()}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle
                as="h2"
                className="text-xl/7 font-medium text-white"
              >
                Info needed
              </DialogTitle>
              <p className="mt-2 text-base text-white/50">{message}</p>
              <div className="mt-4 flex gap-10">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                  onClick={() => onClose()}
                >
                  Nope
                </Button>
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-red-500 px-5 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-red-400 data-open:bg-red-500"
                  onClick={() => onConfirm()}
                >
                  Yep
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
