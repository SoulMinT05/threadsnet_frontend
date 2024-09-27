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
import { formatDistanceToNow } from 'date-fns';
import ActionsFollowingPostComponent from '../ActionsFollowingPostComponent/ActionsFollowingPostComponent';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';

import { AiFillLock } from 'react-icons/ai';
import { MdPublic } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import postAtom from '../../atoms/postAtom';

const FollowingPostComponent = ({ followingPost, postedBy, isLastPost }) => {
    const [visibility, setVisibility] = useState(followingPost?.visibility);
    const [showTooltip, setShowTooltip] = useState(false);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postAtom);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const currentUser = useRecoilValue(userAtom);
    const [saved, setSaved] = useState(false); // Giá trị khởi tạo là false
    const [isSaving, setIsSaving] = useState(false);

    // Cập nhật giá trị `saved` khi `user` hoặc `followingPost` thay đổi
    useEffect(() => {
        if (user && followingPost) {
            console.log('followingPost.savedLists:', followingPost.savedLists);
            console.log('user._id:', user._id);
            setSaved(followingPost.savedLists.includes(user._id));
        }
    }, [user, followingPost]);

    console.log('saved: ', saved);

    useEffect(() => {
        const getUser = async () => {
            if (!postedBy) return;

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

    const handleVisibilityChange = async (e) => {
        const newVisibility = e.currentTarget.getAttribute('value');
        setVisibility(newVisibility);

        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;

            const res = await fetch(`/api/post/updateVisibilityPost/${followingPost._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    postId: followingPost?._id,
                    visibility: newVisibility,
                }),
            });
            const data = await res.json();
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }

            showToast('Success', data.message, 'success');
            setPosts((prevPosts) => {
                return prevPosts.map((p) => (p._id === followingPost._id ? { ...p, visibility: newVisibility } : p));
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
            const res = await fetch(`/api/post/saved/${followingPost._id}`, {
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
                    if (p._id === followingPost._id) {
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
                    if (p._id === followingPost._id) {
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
            const res = await fetch(`/api/post/${followingPost._id}`, {
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
            setPosts(posts.filter((p) => p._id !== followingPost._id));
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <>
            <Link to={`/${user.username}/post/${followingPost._id}`}>
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
                                    {formatDistanceToNow(new Date(followingPost.createdAt))}
                                </Text>
                                <Box width={36} onClick={(e) => e.preventDefault()}>
                                    <Menu>
                                        <Tooltip
                                            label={
                                                followingPost.visibility.charAt(0).toUpperCase() +
                                                followingPost.visibility.slice(1)
                                            }
                                            aria-label={followingPost.visibility}
                                            isClose={showTooltip}
                                        >
                                            <MenuButton mt={'6px'}>
                                                {followingPost.visibility === 'public' && (
                                                    <MdPublic color="gray" size={16} />
                                                )}
                                                {followingPost.visibility === 'private' && (
                                                    <AiFillLock color="gray" size={16} />
                                                )}
                                                {followingPost.visibility === 'friends' && (
                                                    <FaUserFriends color="gray" size={16} />
                                                )}
                                                {followingPost.visibility === 'followers' && (
                                                    <MdGroups color="gray" size={20} />
                                                )}
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
                            {followingPost.text}
                        </Text>
                        {followingPost.image && (
                            <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                                <Image
                                    maxHeight={'560px'}
                                    objectFit={'cover'}
                                    src={followingPost.image}
                                    w={'full'}
                                    alt="Image"
                                />
                            </Box>
                        )}
                        <Flex gap={3} my={1} alignItems={'center'}>
                            <ActionsFollowingPostComponent followingPost={followingPost} />
                        </Flex>
                    </Flex>
                </Flex>
            </Link>
            {!isLastPost && <Divider orientation="horizontal" />}
        </>
    );
};

export default FollowingPostComponent;

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
