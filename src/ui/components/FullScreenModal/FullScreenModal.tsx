import { ReactNode } from "react";
import Modal from "react-modal";
import { BooleanSetter } from "../../../types";


interface FullScreenModalProps {
    children?: ReactNode;
    modalIsOpen: boolean;
    setModalIsOpen: BooleanSetter;
}

export default function FullScreenModal({ modalIsOpen, setModalIsOpen, children }: FullScreenModalProps) {

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            ariaHideApp={false}
            style={{
                content: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10em 1.5em 1.5em 1.5em",
                    margin: "-3em",
                    borderRadius: "2em",
                    textAlign: "center",
                },
            }}
        >
            {children}
        </Modal>
    )
}