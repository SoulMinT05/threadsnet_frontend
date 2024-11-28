import React from 'react';
import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { BsCheck2All } from 'react-icons/bs';
import { selectedConversationAtom } from '../../atoms/messageAtom';
import userAtom from '../../atoms/userAtom';

const MessageComponent = ({ ownMessage, message }) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const user = useRecoilValue(userAtom);
    return (
        <>
            {ownMessage ? (
                <Flex gap={2} alignSelf={'flex-end'}>
                    <Flex bg={'green.800'} maxW={'350px'} p={1} borderRadius={'md'}>
                        <Text color={'white'}>{message.text}</Text>
                        <Box alignSelf={'flex-end'} ml={1} color={message.seen ? 'blue.400' : ''} fontWeight={'bold'}>
                            <BsCheck2All size={16} />
                        </Box>
                    </Flex>
                    <Avatar src={user.avatar} w="7" h={7} />
                </Flex>
            ) : (
                <Flex gap={2}>
                    <Avatar src={selectedConversation.avatar} w="7" h={7} />
                    <Text maxW={'350px'} bg={'gray.400'} p={1} borderRadius={'md'} color={'black'}>
                        {message.text}
                    </Text>
                </Flex>
            )}
        </>
    );
};

export default MessageComponent;
