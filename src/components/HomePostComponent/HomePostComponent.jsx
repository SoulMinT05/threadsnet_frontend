import { Link, useNavigate } from 'react-router-dom';
import {
    Avatar,
    Box,
    Divider,
    Flex,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Spinner,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { AiFillLock } from 'react-icons/ai';
import { MdPublic } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';

import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import ActionsHomePostComponent from '../ActionsHomePostComponent/ActionsHomePostComponent';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import postAtom from '../../atoms/postAtom';

const HomePostComponent = ({ post, postedBy, isLastPost }) => {
    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const year = date.getFullYear();
    //     return `${day}/${month}/${year}`;
    // };
    const showToast = useShowToast();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postAtom);
    const [visibility, setVisibility] = useState(post?.visibility);
    const [showTooltip, setShowTooltip] = useState(false);
    const [loading, setLoading] = useState(false);

    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user && post) {
            console.log('post.savedLists:', post.savedLists);
            console.log('user._id:', user._id);
            setSaved(post.savedLists.includes(user._id));
        }
    }, [user, post]);

    useEffect(() => {
        console.log('postedBy: ', postedBy);
        const getUser = async () => {
            if (!postedBy) return;
            try {
                const userLogin = JSON.parse(localStorage.getItem('userLogin'));
                const accessToken = userLogin?.accessToken;

                const res = await fetch(`/api/user/profile/` + postedBy, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
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

    const handleVisibilityChange = async (e) => {
        const newVisibility = e.currentTarget.getAttribute('value');
        setVisibility(newVisibility);

        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;

            const res = await fetch(`/api/post/updateVisibilityPost/${post._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    postId: post?._id,
                    visibility: newVisibility,
                }),
            });
            const data = await res.json();
            console.log('dataUpdateVisibility: ', data);
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }

            showToast('Success', data.message, 'success');
            setPosts((prevPosts) => {
                return prevPosts.map((p) => (p._id === post._id ? { ...p, visibility: newVisibility } : p));
            });
            setShowTooltip(false);
        } catch (error) {
            showToast('Error', error, 'error');
        }
    };

    const handleSavePost = async () => {
        if (isSaving) return;
        setIsSaving(true);
        setLoading(true);

        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch(`/api/post/saved/${post._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            console.log('dataSaved: ', data);
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }

            if (!saved) {
                const updatedPosts = posts.map((p) => {
                    if (p._id === post._id) {
                        return {
                            ...p,
                            savedLists: [...p.savedLists, user._id],
                        };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            } else {
                const updatedPosts = posts.map((p) => {
                    if (p._id === post._id) {
                        return {
                            ...p,
                            savedLists: p.savedLists.filter((id) => id !== user._id),
                        };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            }

            setSaved(!saved);
            showToast('Success', data.message, 'success');
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setIsSaving(false);
            setLoading(false);
        }
    };

    const handleDeletePost = async () => {
        setLoading(true);
        try {
            if (!window.confirm('Are you sure you want to delete this post?')) return;
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch(`/api/post/${post._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }
            showToast('Success', 'Deleted post successfully', 'success');
            setPosts(posts.filter((p) => p._id !== post._id));
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <>
            <Link to={`/${user.username}/post/${post._id}`}>
                <Flex gap={3} py={5}>
                    <Flex flexDirection={'column'} alignItems={'center'}>
                        <Avatar
                            size="md"
                            name={user.name}
                            src={user.avatar}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user?.username}`);
                            }}
                        />
                    </Flex>

                    <Flex flex={1} flexDirection={'column'} gap={2}>
                        <Flex justifyContent={'space-between'} w={'full'}>
                            <Flex w={'full'} alignItems={'center'}>
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={'bold'}
                                    _hover={{
                                        textDecoration: 'underline',
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/${user?.username}`);
                                    }}
                                >
                                    {user.username}
                                </Text>
                                <Image src="./verified.png" w={4} h={4} ml={1} />

                                <Text fontSize={'xs'} mx={'8px'} color={'gray.light'}>
                                    {formatDistanceToNow(new Date(post.createdAt))}
                                </Text>
                                <Box width={36} onClick={(e) => e.preventDefault()}>
                                    <Menu
                                        onMouseEnter={() => setShowTooltip(true)} // Hiện tooltip khi hover vào Menu
                                        onMouseLeave={() => setShowTooltip(false)}
                                    >
                                        <Tooltip
                                            label={post.visibility.charAt(0).toUpperCase() + post.visibility.slice(1)}
                                            aria-label={post.visibility}
                                            isClose={showTooltip}
                                        >
                                            <MenuButton mt={'6px'}>
                                                {post.visibility === 'public' && <MdPublic color="gray" size={16} />}
                                                {post.visibility === 'private' && <AiFillLock color="gray" size={16} />}
                                                {post.visibility === 'friends' && (
                                                    <FaUserFriends color="gray" size={16} />
                                                )}
                                                {post.visibility === 'followers' && <MdGroups color="gray" size={20} />}
                                            </MenuButton>
                                        </Tooltip>
                                        {currentUser?.userData?._id === user?._id && (
                                            <Portal>
                                                <MenuList>
                                                    <MenuItem
                                                        onClick={handleVisibilityChange}
                                                        value="public"
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        padding={'12px'}
                                                    >
                                                        Public
                                                        <MdPublic color="gray" size={16} />
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={handleVisibilityChange}
                                                        value="friends"
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        padding={'12px'}
                                                    >
                                                        Friends
                                                        <FaUserFriends color="gray" size={16} />
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={handleVisibilityChange}
                                                        value="followers"
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        padding={'12px'}
                                                    >
                                                        Followers
                                                        <MdGroups color="gray" size={20} />
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={handleVisibilityChange}
                                                        value="private"
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        padding={'12px'}
                                                    >
                                                        Private
                                                        <AiFillLock color="gray" size={16} />
                                                    </MenuItem>
                                                </MenuList>
                                            </Portal>
                                        )}
                                    </Menu>
                                </Box>
                            </Flex>
                            <Flex gap={4} alignItems={'center'} marginRight={'-12px'}>
                                <Box className="icon-container" onClick={(e) => e.preventDefault()}>
                                    <Menu>
                                        <MenuButton width={'40px'} padding={'3px 0px'}>
                                            <ThreeDotsSVG />
                                        </MenuButton>
                                        <Portal>
                                            <MenuList>
                                                <MenuItem
                                                    onClick={handleSavePost}
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    padding={'12px'}
                                                >
                                                    {saved ? 'Unsave' : 'Save'}
                                                    {saved ? <UnsaveSVG /> : <SaveSVG />}
                                                    {/* {saved ? 'Save' : 'Unsave'}
                                                    {saved ? <SaveSVG /> : <UnsaveSVG />} */}
                                                </MenuItem>
                                                {currentUser?.userData?._id === user?._id && (
                                                    <>
                                                        <Divider />
                                                        <MenuItem
                                                            onClick={handleDeletePost}
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            padding={'12px'}
                                                            color={'red'}
                                                        >
                                                            {loading ? (
                                                                <>
                                                                    Deleting...
                                                                    <Spinner size="sm" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Delete
                                                                    <DeleteSVG />
                                                                </>
                                                            )}
                                                        </MenuItem>

                                                        <Divider />
                                                    </>
                                                )}
                                            </MenuList>
                                        </Portal>
                                    </Menu>
                                </Box>
                            </Flex>
                        </Flex>
                        <Text fontSize={'sm'} marginTop={'-8px'}>
                            {post.text}
                        </Text>
                        {post.image && (
                            <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                                <Image
                                    maxHeight={'560px'}
                                    objectFit={'cover'}
                                    src={post.image}
                                    w={'full'}
                                    alt="Image"
                                />
                            </Box>
                        )}
                        <Flex gap={3} my={1} alignItems={'center'}>
                            <ActionsHomePostComponent post={post} />
                        </Flex>
                    </Flex>
                </Flex>
            </Link>
            {!isLastPost && <Divider orientation="horizontal" />}
        </>
    );
};

export default HomePostComponent;

const ThreeDotsSVG = () => {
    return (
        <svg
            aria-label="More"
            color="currentColor"
            fill="currentColor"
            role="img"
            viewBox="0 0 24 24"
            height="20"
            width="20"
        >
            <title>More</title>
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="6" cy="12" r="1.5"></circle>
            <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
    );
};

const SaveSVG = () => {
    return (
        <svg aria-label="Save" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
            <title>Save</title>
            <polygon
                fill="none"
                points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            ></polygon>
        </svg>
    );
};

const UnsaveSVG = () => {
    return (
        <svg aria-label="Remove" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
            <title>Remove</title>
            <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
        </svg>
    );
};

const DeleteSVG = () => {
    return (
        <svg
            aria-label="Delete"
            color="currentColor"
            fill="currentColor"
            role="img"
            viewBox="0 0 20 20"
            height="20"
            width="20"
        >
            <title>Delete</title>
            <path
                d="M6.75 3.5V2.5C6.75 1.67157 7.42157 1 8.25 1H11.75C12.5784 1 13.25 1.67157 13.25 2.5V3.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            ></path>
            <path
                d="M3.75 4L4.54449 15.5202C4.61689 16.57 4.6531 17.0949 4.88062 17.4928C5.08095 17.8431 5.38256 18.1246 5.74584 18.3004C6.15846 18.5 6.68461 18.5 7.73691 18.5H12.2631C13.3154 18.5 13.8415 18.5 14.2542 18.3004C14.6174 18.1246 14.9191 17.8431 15.1194 17.4928C15.3469 17.0949 15.3831 16.57 15.4555 15.5202L16.25 4M3.75 4H16.25M3.75 4H1.75M16.25 4H18.25"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
            ></path>
        </svg>
    );
};

const LogoFollowers = () => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            color="gray"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            style="color: gray;width: 20px;"
        >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"></path>
        </svg>
    );
};
