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
import { BsFillImageFill } from 'react-icons/bs';

const MessageInputComponent = ({ setMessages }) => {
    const [messageText, setMessageText] = useState('');
    const [imgUrl, setImgUrl] = useState(null); // URL của hình ảnh
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const setConversations = useSetRecoilState(conversationsAtom);
    const imageRef = useRef(null);
    const { onClose } = useDisclosure();
    // const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const [isSending, setIsSending] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Vui lòng chọn file hình ảnh hợp lệ!');
        }
    };

    console.log('imgUrl: ', imgUrl);
    console.log('imageRef: ', imageRef);

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
            setImgUrl('');
        } catch (error) {
            showToast('Error', error.message, 'error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        // <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        //     <InputGroup>
        //         <Input
        //             w={'full'}
        //             placeholder="Type a message"
        //             onChange={(e) => setMessageText(e.target.value)}
        //             value={messageText}
        //         />
        //         <InputRightElement onClick={handleSendMessage} cursor={'pointer'}>
        //             <IoSendSharp />
        //         </InputRightElement>
        //     </InputGroup>
        // </form>
        <Flex gap={2} alignItems={'center'}>
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
            <Flex flex={5} cursor={'pointer'}>
                <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
                <Input type={'file'} hidden ref={imageRef} onChange={handleImageChange} />
            </Flex>
            <Modal
                isOpen={imgUrl}
                onClose={() => {
                    onClose();
                    setImgUrl('');
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex mt={5} w={'full'}>
                            {imgUrl ? (
                                <Image src={imgUrl} maxW={'100%'} maxH={'364px'} objectFit={'contain'} />
                            ) : (
                                <Spinner />
                            )}
                        </Flex>
                        <Flex justifyContent={'flex-end'} my={2}>
                            {!isSending ? (
                                <IoSendSharp size={24} cursor={'pointer'} onClick={handleSendMessage} />
                            ) : (
                                <Spinner size={'md'} />
                            )}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default MessageInputComponent;
