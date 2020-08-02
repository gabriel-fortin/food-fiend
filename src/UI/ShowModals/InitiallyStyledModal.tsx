import React from "react";
import { Modal, useDisclosure, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Box, ModalHeader } from "@chakra-ui/core";


interface Props {
    onModalClosing: () => void;
}

export const InitiallyStyledModal: React.FC<Props> = ({ onModalClosing }) => {
    const { isOpen: isModalOpen, onClose: closeModal } = useDisclosure(true);

    const onUserActionToCloseModal = () => {
        closeModal();
        onModalClosing();
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onUserActionToCloseModal}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton onClick={onUserActionToCloseModal} />
                <ModalBody>
                    Hello
                    <Box>
                        Here's some text
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
