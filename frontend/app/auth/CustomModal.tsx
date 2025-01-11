import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@nextui-org/modal";

const CustomModal = ({title, isOpen, onClose , children }: {title: string; isOpen: boolean; onClose: () => void;  children: React.ReactNode;}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}
               size={"md"}
               className="bg-default-100"
        >
            <ModalContent>
                <ModalHeader>
                    <h2 className="text-lg">{title}</h2>
                </ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CustomModal;