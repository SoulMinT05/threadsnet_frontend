import React from 'react';
import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';

const MessageComponent = ({ ownMessage }) => {
    return (
        <>
            {ownMessage ? (
                <Flex gap={2} alignSelf={'flex-end'}>
                    <Text maxW={'350px'} bg={'blue.400'} p={1} borderRadius={'md'}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis inventore molestias culpa
                        voluptas recusandae voluptate id aut? Illo, sequi at.
                    </Text>

                    <Avatar src="" w="7" h={7} />
                </Flex>
            ) : (
                <Flex gap={2}>
                    <Avatar src="" w="7" h={7} />
                    <Text maxW={'350px'} bg={'gray.400'} p={1} borderRadius={'md'} color={'black'}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis inventore molestias culpa
                        voluptas recusandae voluptate id aut? Illo, sequi at.
                    </Text>
                </Flex>
            )}
        </>
    );
};

export default MessageComponent;
