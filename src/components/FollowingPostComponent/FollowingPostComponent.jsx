import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import ActionsPost from '../ActionsPost/ActionsPost';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';

const FollowingPostComponent = ({ followingPost, postedBy }) => {
    const [liked, setLiked] = useState(false);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const showToast = useShowToast();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/profile/` + postedBy);
                const data = await res.json();
                if (!data.success) {
                    showToast('Error', data.message, 'error');
                }
                setUser(data.user);
            } catch (error) {
                showToast('Error', error, 'error');
                setUser(null);
            }
        };
        getUser();
    }, [postedBy, showToast]);

    if (!user) return null;

    return (
        <>
            <Link to={`/${user.username}/post/${followingPost._id}`}>
                <Flex gap={3} mb={4} py={5}>
                    <Flex flexDirection={'column'} alignItems={'center'}>
                        <Avatar
                            size="md"
                            name={user.name}
                            src={user.avatar}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`${user?.username}`);
                            }}
                        />
                        <Box w="1px" h={'full'} bg={'gray.light'} my={2}></Box>
                        <Box position={'relative'} w={'full'}>
                            {followingPost.replies.length === 0 && <Text textAlign={'center'}>🥱</Text>}
                            {followingPost.replies[0] && (
                                <Avatar
                                    size="xs"
                                    name="John Doe"
                                    src={followingPost.replies[0].userId}
                                    position={'absolute'}
                                    top={'0px'}
                                    left={'15px'}
                                    padding={'2px'}
                                />
                            )}

                            {followingPost.replies[1] && (
                                <Avatar
                                    size="xs"
                                    name="John Doe"
                                    src={followingPost.replies[1].userId}
                                    position={'absolute'}
                                    bottom={'0px'}
                                    right={'-5px'}
                                    padding={'2px'}
                                />
                            )}

                            {followingPost.replies[2] && (
                                <Avatar
                                    size="xs"
                                    name="John Doe"
                                    src={followingPost.replies[2].userId}
                                    position={'absolute'}
                                    bottom={'0px'}
                                    left={'4px'}
                                    padding={'2px'}
                                />
                            )}
                        </Box>
                    </Flex>
                    <Flex flex={1} flexDirection={'column'} gap={2}>
                        <Flex justifyContent={'space-between'} w={'full'}>
                            <Flex w={'full'} alignItems={'center'}>
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={'bold'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`${user?.username}`);
                                    }}
                                >
                                    {user.username}
                                </Text>
                                {/* {followingPost.followers.length >= 2 && ( */}
                                <Image src="./verified.png" w={4} h={4} ml={1} />
                                {/* )} */}
                            </Flex>
                            <Flex gap={4} alignItems={'center'}>
                                <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>
                                    {/* {formatDate(followingPost.createdAt)} */}
                                    {formatDistanceToNow(new Date(followingPost.createdAt))}
                                </Text>
                            </Flex>
                        </Flex>
                        <Text fontSize={'sm'}>{followingPost.text}</Text>
                        {followingPost.image && (
                            <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                                <Image src={followingPost.image} w={'full'} alt="Image" />
                            </Box>
                        )}
                        <Flex gap={3} my={1} alignItems={'center'}>
                            <ActionsPost
                                // likes={followingPost.likes.length}
                                // replies={followingPost.replies.length}
                                // liked={liked}
                                // setLiked={setLiked}
                                followingPost={followingPost}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Link>
        </>
    );
};

export default FollowingPostComponent;
