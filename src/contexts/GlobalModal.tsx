import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Modal from "../components/Modal";

interface IModalProps {
  title?: string;
  description?: string;
  children: ReactNode;
  isOpen: boolean;
}

interface GlobalModalProps {
  setState: Dispatch<SetStateAction<GlobalModalProps>>;
  setModalProps: (values: IModalProps) => void;
  modalProps: IModalProps;
}

const initialValues = {
  modalProps: {
    title: "",
    description: "",
    children: null,
    isOpen: false,
  },
};
const GlobalModal = createContext<GlobalModalProps>(
  initialValues as GlobalModalProps
);

export const GlobalModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GlobalModalProps>(
    initialValues as GlobalModalProps
  );
  const { modalProps } = state;

  const isOpen = modalProps?.isOpen || false;

  const setIsOpen = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      modalProps: {
        ...prev.modalProps,
        isOpen: value,
      },
    }));
  };

  const setModalProps = (values: IModalProps) => {
    setState((prev) => ({ ...prev, modalProps: values }));
  };

  return (
    <GlobalModal.Provider
      value={{
        ...state,
        setState,
        setModalProps,
      }}
    >
      {children}
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={modalProps.title}
        description={modalProps.description}
      >
        {modalProps.children}
      </Modal>
    </GlobalModal.Provider>
  );
};

export const useGlobalModal = () => {
  const context = useContext(GlobalModal);

  return context;
};
