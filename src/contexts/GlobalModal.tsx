import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Modal, { IModalProps } from "../components/Modal";

type State = {
  modalProps: IModalProps;
};

type Actions = {
  setState: Dispatch<SetStateAction<State>>;
  setModalProps: (values: IModalProps) => void;
  closeModal: () => void;
};

type GlobalModalProps = State & Actions;

const initialValues: State = {
  modalProps: {
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
  const [state, setState] = useState<State>(initialValues);

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

  const closeModal = () => {
    setState((prev) => ({
      ...prev,
      modalProps: {
        isOpen: false,
        children: null,
        description: "",
        title: "",
      },
    }));
  };

  return (
    <GlobalModal.Provider
      value={{
        ...state,
        setState,
        setModalProps,
        closeModal,
      }}
    >
      {children}
      {state.modalProps && (
        <Modal {...state.modalProps} setIsOpen={setIsOpen}>
          {state.modalProps.children}
        </Modal>
      )}
    </GlobalModal.Provider>
  );
};

export const useGlobalModal = () => {
  const context = useContext(GlobalModal);

  return context;
};
