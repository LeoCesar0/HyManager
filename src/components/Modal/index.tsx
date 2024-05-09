import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

export interface IModalProps {
  isOpen: boolean;
  children: ReactNode | null;
  title?: string;
  description?: string;
  autoToggle?: boolean;
}

interface IModal extends IModalProps {
  setIsOpen: (isOpen: boolean) => void;
}

function Modal({
  isOpen,
  setIsOpen,
  children,
  title,
  description,
  autoToggle = true,
}: IModal) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(state) => {
        if (autoToggle) {
          setIsOpen(state);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <>{children}</>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
