import React from "react";
import { Modal, useDisclosure, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Box } from "@chakra-ui/core";

export const ShowModals: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure(true);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
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
