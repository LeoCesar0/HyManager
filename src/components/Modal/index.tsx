import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface IModal {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: ReactNode;
  title?: string;
  description?: string;
}

function Modal({ isOpen, setIsOpen, children, title, description }: IModal) {

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex p-4 items-center justify-center">
            <Dialog.Panel
              className={
                "container min-h-[20rem] w-max bg-surface text-on-surface p-4 rounded-md"
              }
            >
              {title && (
                <Dialog.Title className="text-2xl font-bold">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="text-lg">
                  {description}
                </Dialog.Description>
              )}
              {children}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default Modal;
