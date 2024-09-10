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
    Text,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import ActionsFollowingPostComponent from '../ActionsFollowingPostComponent/ActionsFollowingPostComponent';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';

const FollowingPostComponent = ({ followingPost, postedBy }) => {
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
                                {/* {followingPost.followers.length >= 2 && ( */}
                                <Image src="./verified.png" w={4} h={4} ml={1} />
                                {/* )} */}
                            </Flex>
                            <Flex gap={4} alignItems={'center'}>
                                <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>
                                    {/* {formatDate(followingPost.createdAt)} */}
                                    {formatDistanceToNow(new Date(followingPost.createdAt))}
                                </Text>
                                <Box className="icon-container" onClick={(e) => e.preventDefault()}>
                                    <Menu>
                                        <MenuButton marginTop={'3px'}>
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
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            padding={'12px'}
                                                            color={'red'}
                                                        >
                                                            Delete
                                                            <DeleteSVG />
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
                        <Text fontSize={'sm'}>{followingPost.text}</Text>
                        {followingPost.image && (
                            <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                                <Image src={followingPost.image} w={'full'} alt="Image" />
                            </Box>
                        )}
                        <Flex gap={3} my={1} alignItems={'center'}>
                            <ActionsFollowingPostComponent followingPost={followingPost} />
                        </Flex>
                    </Flex>
                </Flex>
            </Link>
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
