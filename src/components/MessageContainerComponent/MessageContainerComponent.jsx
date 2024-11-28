import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react';
import MessageComponent from '../MessageComponent/MessageComponent';
import MessageInputComponent from '../MessageInputComponent/MessageInputComponent';
import { conversationsAtom, selectedConversationAtom } from '../../atoms/messageAtom';
import useShowToast from '../../hooks/useShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useRef, useState } from 'react';
import userAtom from '../../atoms/userAtom';
import { useSocket } from '../../context/SocketContext';

const MessageContainerComponent = () => {
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const currentUser = useRecoilValue(userAtom);
    const setConversations = useSetRecoilState(conversationsAtom);
    const { socket } = useSocket();
    const messageEndRef = useRef(null);

    useEffect(() => {
        socket.on('newMessage', (message) => {
            if (selectedConversation._id === message.conversationId) {
                setMessages((prev) => [...prev, message]);
            }

            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if (conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender,
                            },
                        };
                    }
                    return conversation;
                });
                return updatedConversations;
            });
        });

        return () => socket.off('newMessage');

        // // make a sound if the window is not focused
        // if (!document.hasFocus()) {
        //     const sound = new Audio(messageSound);
        //     sound.play();
        // }
    }, [socket, selectedConversation, setConversations]);

    useEffect(() => {
		const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
		if (lastMessageIsFromOtherUser) {
			socket.emit("markMessagesAsSeen", {
				conversationId: selectedConversation._id,
				userId: selectedConversation.userId,
			});
		}

		socket.on("messagesSeen", ({ conversationId }) => {
			if (selectedConversation._id === conversationId) {
				setMessages((prev) => {
					const updatedMessages = prev.map((message) => {
						if (!message.seen) {
							return {
								...message,
								seen: true,
							};
						}
						return message;
					});
					return updatedMessages;
				});
			}
		});
	}, [socket, currentUser._id, messages, selectedConversation]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessages(true);
            setMessages([]);
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;

            try {
                if (selectedConversation.mock) return;
                const res = await fetch(`/api/message/${selectedConversation.userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await res.json();
                if (data.error) {
                    showToast('Error', data.error, 'error');
                    return;
                }
                console.log('dataMessageCOntainer: ', data);
                setMessages(data);
            } catch (error) {
                showToast('Error', error.message, 'error');
            } finally {
                setLoadingMessages(false);
            }
        };

        getMessages();
    }, [showToast, selectedConversation.userId, selectedConversation.mock]);
    return (
        <Flex
            flex="70"
            bg={useColorModeValue('gray.200', 'gray.dark')}
            borderRadius={'md'}
            p={2}
            flexDirection={'column'}
        >
            {/* Message header */}
            <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
                <Avatar src={selectedConversation.avatar} size={'sm'} />
                <Text display={'flex'} alignItems={'center'}>
                    {selectedConversation.username} <Image src="/verified.png" w={4} h={4} ml={1} />
                </Text>
            </Flex>

            <Divider />

            <Flex flexDir={'column'} gap={4} my={4} p={2} height={'400px'} overflowY={'auto'}>
                {loadingMessages &&
                    [...Array(5)].map((_, i) => (
                        <Flex
                            key={i}
                            gap={2}
                            alignItems={'center'}
                            p={1}
                            borderRadius={'md'}
                            alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}
                        >
                            {i % 2 === 0 && <SkeletonCircle size={7} />}
                            <Flex flexDir={'column'} gap={2}>
                                <Skeleton h="8px" w="250px" />
                                <Skeleton h="8px" w="250px" />
                                <Skeleton h="8px" w="250px" />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={7} />}
                        </Flex>
                    ))}

                {!loadingMessages &&
                    messages.map((message) => {
                        return (
                            <Flex
                                key={message._id}
                                direction={'column'}
                                ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
                            >
                                <MessageComponent
                                    message={message}
                                    ownMessage={currentUser.userData._id === message.sender}
                                />
                            </Flex>
                        );
                    })}
            </Flex>

            <MessageInputComponent setMessages={setMessages} />
        </Flex>
    );
};

export default MessageContainerComponent;