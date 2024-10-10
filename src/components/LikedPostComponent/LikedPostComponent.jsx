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
// import ActionsFollowingPostComponent from '../ActionsFollowingPostComponent/ActionsFollowingPostComponent';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';

import { AiFillLock } from 'react-icons/ai';
import { MdPublic } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import postAtom from '../../atoms/postAtom';
import ActionsLikedPostComponent from '../ActionsLikedPostComponent/ActionsLikedPostComponent';

const LikedPostComponent = ({ likedPost, postedBy, isLastPost }) => {
    const [visibility, setVisibility] = useState(likedPost?.visibility);
    const [showTooltip, setShowTooltip] = useState(false);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postAtom);

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
    const currentUser = useRecoilValue(userAtom);
    console.log('postedByLiekd: ', postedBy);

    useEffect(() => {
        const getUser = async () => {
            // if (!postedBy?._id) return;

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
                console.log('dataUserProfile: ', data);
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

            const res = await fetch(`/api/post/updateVisibilityPost/${likedPost._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    postId: likedPost?._id,
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
                return prevPosts.map((p) => (p._id === likedPost._id ? { ...p, visibility: newVisibility } : p));
            });
            setShowTooltip(false);
        } catch (error) {
            showToast('Error', error, 'error');
        }
    };

    const handleDeletePost = async () => {
        setLoading(true);
        try {
            if (!window.confirm('Are you sure you want to delete this post?')) return;
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch(`/api/post/${likedPost._id}`, {
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
            setPosts(posts.filter((p) => p._id !== likedPost._id));
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <>
            <Link to={`/${user?.username}/post/${likedPost._id}`}>
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
                                    {user?.username}
                                </Text>
                                <Image src="./verified.png" w={4} h={4} ml={1} />

                                <Text fontSize={'xs'} mx={'8px'} color={'gray.light'}>
                                    {formatDistanceToNow(new Date(likedPost.createdAt))}
                                </Text>
                                <Box width={36} onClick={(e) => e.preventDefault()}>
                                    <Menu>
                                        <Tooltip
                                            label={
                                                likedPost.visibility.charAt(0).toUpperCase() +
                                                likedPost.visibility.slice(1)
                                            }
                                            aria-label={likedPost.visibility}
                                            isClose={showTooltip}
                                        >
                                            <MenuButton mt={'6px'}>
                                                {likedPost.visibility === 'public' && (
                                                    <MdPublic color="gray" size={16} />
                                                )}
                                                {likedPost.visibility === 'private' && (
                                                    <AiFillLock color="gray" size={16} />
                                                )}
                                                {likedPost.visibility === 'friends' && (
                                                    <FaUserFriends color="gray" size={16} />
                                                )}
                                                {likedPost.visibility === 'followers' && (
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
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    padding={'12px'}
                                                >
                                                    Save
                                                    <SaveSVG />
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
                            {likedPost.text}
                        </Text>
                        {likedPost.image && (
                            <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                                <Image
                                    maxHeight={'560px'}
                                    objectFit={'cover'}
                                    src={likedPost.image}
                                    w={'full'}
                                    alt="Image"
                                />
                            </Box>
                        )}
                        <Flex gap={3} my={1} alignItems={'center'}>
                            <ActionsLikedPostComponent likedPost={likedPost} />
                        </Flex>
                    </Flex>
                </Flex>
            </Link>
            {/* <Text>{likedPost.text}</Text> */}
            {!isLastPost && <Divider orientation="horizontal" />}
        </>
    );
};

export default LikedPostComponent;

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
        <svg
            aria-label=""
            role="img"
            viewBox="0 0 20 20"
            color="currentColor"
            fill="currentColor"
            height="20"
            width="20"
        >
            <title></title>
            <path d="M3.40039 17.7891V3.94995C3.40039 2.43117 4.6316 1.19995 6.15039 1.19995H13.8448C15.3636 1.19995 16.5948 2.43117 16.5948 3.94995V17.6516C16.5948 18.592 15.4579 19.063 14.7929 18.398L10.6201 14.2252C10.4198 14.0249 10.097 14.0184 9.88889 14.2106L5.17191 18.5647C4.49575 19.1888 3.40039 18.7093 3.40039 17.7891Z"></path>
        </svg>
    );
};

const UnsaveSVG = () => {
    return (
        <svg
            aria-label=""
            role="img"
            viewBox="0 0 20 20"
            color="currentColor"
            fill="currentColor"
            height="20"
            width="20"
        >
            <title></title>
            <path
                d="M2.6084 5.6994V17.789C2.6084 19.3993 4.52528 20.2386 5.70855 19.1463L10.2392 14.9642L14.2328 18.9577C14.9168 19.6418 15.8863 19.6389 16.5692 19.1861L10.4748 13.2987C10.0828 13.2301 9.66521 13.3393 9.35159 13.6288L4.63461 17.9829C4.46557 18.1389 4.19173 18.019 4.19173 17.789V7.22896L2.6084 5.6994ZM15.8028 12.1889V3.94987C15.8028 2.86831 14.9261 1.99154 13.8445 1.99154H6.15006C5.88463 1.99154 5.63152 2.04435 5.40069 2.14003L4.20789 0.987743C4.76557 0.621348 5.43292 0.408203 6.15006 0.408203H13.8445C15.8005 0.408203 17.3862 1.99386 17.3862 3.94987V13.7185L15.8028 12.1889Z"
                fill="currentColor"
            ></path>
            <path d="M1.5 1.5L18.5 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"></path>
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
