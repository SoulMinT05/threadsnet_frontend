import { Avatar, Divider, Flex, Text } from '@chakra-ui/react';
import './Comment.scss';
import { BsThreeDots } from 'react-icons/bs';
import ActionsPost from '../ActionsPost/ActionsPost';
import { useState } from 'react';
const Comment = ({ comment, createdAt, likes, username, userAvatar }) => {
    const [liked, setLiked] = useState(false);
    return (
        <>
            <Flex gap={4} py={2} my={2} w={'full'}>
                <Avatar src={userAvatar} size={'sm'} />
                <Flex gap={1} w={'full'} flexDirection={'column'}>
                    <Flex w={'full'} justifyContent={'space-between'} align={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>
                            {username}
                        </Text>
                        <Flex gap={2} alignItems={'center'}>
                            <Text fontSize={'sm'} color={'gray.light'}>
                                {createdAt}
                            </Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text>{comment}</Text>
                    <ActionsPost likes={likes} liked={liked} setLiked={setLiked} />
                    <Text fontSize={'sm'} color={'gray.light'}>
                        {likes + (liked ? 1 : 0)} likes
                    </Text>
                </Flex>
            </Flex>
            <Divider my={4} />
        </>
    );
};

export default Comment;
