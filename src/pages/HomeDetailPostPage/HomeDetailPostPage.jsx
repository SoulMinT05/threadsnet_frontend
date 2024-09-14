import {
    Avatar,
    Box,
    Button,
    CloseButton,
    Divider,
    Flex,
    FormControl,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Portal,
    Spinner,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import './HomeDetailPostPage.scss';
import { BsFillImageFill } from 'react-icons/bs';
import { useEffect } from 'react';
import CommentComponent from '../../components/CommentComponent/CommentComponent';
import { useRecoilState, useRecoilValue } from 'recoil';
import useGetUserProfile from '../../hooks/useGetUserProfile';
import useShowToast from '../../hooks/useShowToast';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import userAtom from '../../atoms/userAtom';
import ActionsHomePostComponent from '../../components/ActionsHomePostComponent/ActionsHomePostComponent';
import postAtom from '../../atoms/postAtom';
const HomeDetailPostPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { loading, user } = useGetUserProfile();

    const { postId } = useParams();
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postAtom);
    const navigate = useNavigate();
    const currentPost = posts[0];
    useEffect(() => {
        const getDetailPost = async () => {
            setPosts([]);
            try {
                const res = await fetch(`/api/post/${postId}`);
                const data = await res.json();
                console.log('dataGetDetail: ', data);

                // if (!data.success) {
                //     showToast('Error', data.message, 'error');
                //     return;
                // }
                if (data.error) {
                    showToast('Error', data.message, 'error');
                    return;
                }
                setPosts([data]);
            } catch (error) {
                showToast('Error', error, 'error');
            }
        };
        getDetailPost();
    }, [postId, showToast, setPosts]);

    if (!user && loading) {
        return (
            <Flex justifyContent={'center'}>
                <Spinner size={'xl'} />
            </Flex>
        );
    }

    if (!currentPost) return null;
    const handleDeletePost = async () => {
        try {
            if (!window.confirm('Are you sure you want to delete this post?')) return;
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch(`/api/post/${currentPost._id}`, {
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
            navigate(`/${user?.username}`);
        } catch (error) {
            showToast('Error', error, 'error');
        }
    };
    return (
        <>
            <Flex>
                <Flex w={'full'} alignItems={'center'} gap={3}>
                    <Avatar src={user?.avatar} size={'md'} name={user?.name} />
                    <Flex w={'full'} alignItems={'center'}>
                        <Text
                            fontSize={'sm'}
                            fontWeight={'bold'}
                            _hover={{
                                textDecoration: 'underline',
                            }}
                            cursor={'pointer'}
                        >
                            {user?.username}
                        </Text>
                        <Image src="/verified.png" w="4" h={4} marginLeft={'4px'} />
                    </Flex>
                </Flex>
                {/* <Flex gap={4} alignItems={'center'}>
                    <Text fontSize={'sm'} color={'gray.light'}>
                        {formatDistanceToNow(new Date(user?.createdAt))}
                    </Text>
                    <BsThreeDots />
                </Flex> */}
                <Flex gap={4} alignItems={'center'} marginRight={'-12px'}>
                    <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>
                        {formatDistanceToNow(new Date(currentPost?.createdAt))}
                    </Text>
                    <Box className="icon-container" onClick={(e) => e.preventDefault()}>
                        <Menu>
                            <MenuButton marginTop={'3px'}>
                                <ThreeDotsSVG />
                            </MenuButton>
                            <Portal>
                                <MenuList>
                                    <MenuItem display="flex" justifyContent="space-between" padding={'12px'}>
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
            <Text fontSize={'sm'} my={'10px'}>
                {currentPost?.text}
            </Text>

            {currentPost?.image && (
                <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                    <Image src={currentPost?.image} w={'full'} />
                </Box>
            )}

            <Flex gap={3} my={3} alignItems={'center'}>
                <ActionsHomePostComponent post={currentPost} />
            </Flex>
            <Divider my={4} />
            <Flex justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text fontSize={'15px'}>Replies</Text>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Create Post</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    {/* <TextArea placeholder="Post content go here" onChange={handleTextChange} value={postText} /> */}
                                    <Text
                                        fontSize={'xs'}
                                        fontWeight={'bold'}
                                        textAlign={'right'}
                                        m={'1'}
                                        color={'gray.800'}
                                    >
                                        500
                                    </Text>
                                    {/* <Input type="file" hidden ref={imgRef} onChange={handleImgChange} /> */}
                                    <BsFillImageFill style={{ marginLeft: '5px', cursor: 'pointer' }} size={16} />
                                </FormControl>
                                <Flex mt={5} w={'full'} position={'relative'}>
                                    <Image
                                        src="https://res.cloudinary.com/dd4zrjxvc/image/upload/v1725809723/threadsnet/d5mxouhgydlkltvvnx51.jpg"
                                        alt="Selected img"
                                    />
                                    <CloseButton bg={'gray.800'} position={'absolute'} top={2} right={2} />
                                </Flex>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme="blue" mr={3}>
                                    Post
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
                <Flex alignItems={'center'} justifyContent={'end'}>
                    <Text fontSize={'15px'} opacity={0.6}>
                        View Activity
                    </Text>
                    {/* <RightArrowSVG /> */}
                </Flex>
            </Flex>
            <Divider my={4} />
            {currentPost?.replies?.map((reply) => (
                <CommentComponent
                    key={reply?._id}
                    reply={reply}
                    lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
                />
            ))}
        </>
    );
};

export default HomeDetailPostPage;

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

const RightArrowSVG = () => {
    return (
        <svg
            aria-label="View activity"
            role="img"
            viewBox="0 0 24 24"
            fill="currentColor"
            height={'12px'}
            width={'12px'}
        >
            <title>View activity</title>
            <polyline points="16.502 3 7.498 12 16.502 21"></polyline>
        </svg>
    );
};
