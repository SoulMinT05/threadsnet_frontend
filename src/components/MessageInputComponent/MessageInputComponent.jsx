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
import useShowToast from '../../hooks/useShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../../atoms/messageAtom';
import usePreviewImg from '../../hooks/usePreviewImg';

const MessageInputComponent = ({ setMessages }) => {
    const [messageText, setMessageText] = useState('');
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const setConversations = useSetRecoilState(conversationsAtom);
    const imageRef = useRef(null);
    const { onClose } = useDisclosure();
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText && !imgUrl) return;
        if (isSending) return;

        setIsSending(true);
        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    message: messageText,
                    recipientId: selectedConversation.userId,
                    img: imgUrl,
                }),
            });
            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }
            console.log('dataSendMsg: ', data);
            setMessages((messages) => [...messages, data]);

            setConversations((prevConvs) => {
                const updatedConversations = prevConvs.map((conversation) => {
                    if (conversation._id === selectedConversation._id) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: messageText,
                                sender: data.sender,
                            },
                        };
                    }
                    return conversation;
                });
                return updatedConversations;
            });
            setMessageText('');
            // setImgUrl('');
        } catch (error) {
            showToast('Error', error.message, 'error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
            <InputGroup>
                <Input
                    w={'full'}
                    placeholder="Type a message"
                    onChange={(e) => setMessageText(e.target.value)}
                    value={messageText}
                />
                <InputRightElement onClick={handleSendMessage} cursor={'pointer'}>
                    <IoSendSharp />
                </InputRightElement>
            </InputGroup>
        </form>
    );
};

export default MessageInputComponent;
