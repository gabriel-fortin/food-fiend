import React, { ReactNode } from "react";
import { Modal, useDisclosure, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader } from "@chakra-ui/core";


interface Props {
    title?: string;
    onModalClosing: () => void;
    // children: JSX.Element[] | JSX.Element;
    children: ReactNode;
}

export const InitiallyStyledModal: React.FC<Props> = ({ title, onModalClosing, children }) => {
    const { isOpen: isModalOpen, onClose: closeModal } = useDisclosure(true);

    const onUserActionToCloseModal = () => {
        closeModal();
        onModalClosing();
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onUserActionToCloseModal}
            size="xl"
            // size="full"
        >
            <ModalOverlay />
            <ModalContent>
                {title &&
                    <ModalHeader>
                        {title}
                    </ModalHeader>
                }
                <ModalCloseButton onClick={onUserActionToCloseModal} />
                <ModalBody>
                    {children}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
