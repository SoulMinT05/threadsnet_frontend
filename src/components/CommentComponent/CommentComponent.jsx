import { Avatar, Divider, Flex, Text } from '@chakra-ui/react';
import './CommentComponent.scss';
import { BsThreeDots } from 'react-icons/bs';
import ActionsFollowingPostComponent from '../ActionsFollowingPostComponent/ActionsFollowingPostComponent';
import { useState } from 'react';
import ActionsHomePostComponent from '../ActionsHomePostComponent/ActionsHomePostComponent';
import { useRecoilState } from 'recoil';
import postAtom from '../../atoms/postAtom';
import ActionsCommentComponent from '../ActionsCommentComponent/ActionsCommentComponent';
import { formatDistanceToNow } from 'date-fns';
const CommentComponent = ({ reply, lastReply }) => {
    const [posts, setPosts] = useRecoilState(postAtom);
    const [liked, setLiked] = useState(false);
    console.log('reply: ', reply);

    return (
        <>
            <Flex gap={4} py={2} my={4} w={'full'}>
                <Avatar src={reply?.avatar} size={'sm'} />
                <Flex gap={1} w={'full'} flexDirection={'column'}>
                    <Flex w={'full'} justifyContent={'space-between'} align={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>
                            {reply?.username}
                        </Text>
                        <Flex gap={2} alignItems={'center'}>
                            <Text fontSize={'sm'} color={'gray.light'} marginRight={'4px'}>
                                {formatDistanceToNow(new Date(reply?.createdAt))}
                            </Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text>{reply?.textComment}</Text>
                    {/* <ActionsCommentComponent /> */}
                </Flex>
            </Flex>
            {!lastReply ? <Divider my={4} /> : null}
        </>
    );
};

export default CommentComponent;
