import React from "react";
import { Modal, useDisclosure, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Box } from "@chakra-ui/core";


interface Props {
    onModalClosing: () => void;
}

export const InitiallyStyledModal: React.FC<Props> = ({ onModalClosing }) => {
    const { isOpen: isModalOpen, onClose: closeModal } = useDisclosure(true);

    const onCloseButtonClick = () => {
        closeModal();
        onModalClosing();
    };

    return (
        <Modal
            isOpen={isModalOpen}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton onClick={onCloseButtonClick} />
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
