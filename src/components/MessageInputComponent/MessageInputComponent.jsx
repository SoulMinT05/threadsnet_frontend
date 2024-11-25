import {
    Flex,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';

const MessageInputComponent = () => {
    return (
        <form>
            <InputGroup>
                <Input w={'full'} placeholder="Type a message" />
                <InputRightElement cursor={'pointer'}>
                    <IoSendSharp />
                </InputRightElement>
            </InputGroup>
        </form>
    );
};

export default MessageInputComponent;
