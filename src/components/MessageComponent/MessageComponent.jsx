import React from 'react';
import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { selectedConversationAtom } from '../../atoms/messageAtom';
import userAtom from '../../atoms/userAtom';

const MessageComponent = ({ ownMessage, message }) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const user = useRecoilValue(userAtom);
    return (
        <>
            {ownMessage ? (
                <Flex gap={2} alignSelf={'flex-end'}>
                    <Text maxW={'350px'} bg={'blue.400'} p={1} borderRadius={'md'}>
                        {message.text}
                    </Text>
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
