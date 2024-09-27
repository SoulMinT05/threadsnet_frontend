import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Spinner,
    Text,
    Textarea,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import commentAtom from '../../atoms/commentAtom';
import useShowToast from '../../hooks/useShowToast';
import postAtom from '../../atoms/postAtom';
import ActionsReplyComponent from '../ActionsReplyComponent/ActionsReplyComponent';
import { BsThreeDots } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';
const ActionsHomePostComponent = ({ comment }) => {
    //destructuring: post_ is object copied from post
    const userByAtom = useRecoilValue(userAtom);
    const user = userByAtom?.userData;
    const currentUser = useRecoilValue(userAtom);
    const [liked, setLiked] = useState(comment.likes.includes(user?._id)); //problem
    const [posts, setPosts] = useRecoilState(postAtom);

    const [loading, setLoading] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState('');
    const [showTextarea, setShowTextarea] = useState(false);
    const showToast = useShowToast();

    const handleLikedComment = async () => {
        if (!user) return showToast('Error', 'You need to be logged in to like a post', 'error');
        if (isLiking) return;
        setIsLiking(true);

        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch('/api/comment/like/' + comment._id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            });

            const data = await res.json();
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }

            if (!liked) {
                const updatedPosts = posts.map((post) => {
                    const updatedComments = post.comments.map((likeComment) => {
                        if (likeComment._id === comment._id) {
                            const updatedComment = {
                                ...likeComment,
                                likes: [...likeComment.likes, user._id],
                            };
                            return updatedComment;
                        }
                        return likeComment;
                    });
                    return {
                        ...post,
                        comments: updatedComments,
                    };
                });
                setPosts(updatedPosts);
            } else {
                const updatedPosts = posts.map((post) => {
                    const updatedComments = post.comments.map((likeComment) => {
                        if (likeComment._id === comment._id) {
                            const updatedComment = {
                                ...likeComment,
                                likes: likeComment.likes.filter((id) => id !== user._id), // Bỏ like của user
                            };
                            return updatedComment;
                        }
                        return likeComment;
                    });
                    return {
                        ...post,
                        comments: updatedComments,
                    };
                });
                setPosts(updatedPosts);
            }
            setLiked(!liked);
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setIsLiking(false);
        }
    };

    const inputRef = useRef(null);
    const handleCommentClick = () => {
        setShowTextarea(true);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleReplyComment();
        }
    };
    const handleReplyComment = async () => {
        if (!user) {
            return showToast('Error', 'You need to be logged in to reply', 'error');
        }
        if (isReplying) return;
        setIsReplying(true);
        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch('/api/comment/create/reply/' + comment._id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify({
                    textComment: reply,
                }),
            });
            const data = await res.json();
            if (!data.success) return showToast('Error', data.message, 'error');

            const newReply = data.parentComment.replies[data.parentComment.replies.length - 1];
            const updatedPosts = posts.map((post) => {
                if (post._id === data.parentComment.postId) {
                    const updatedComments = post.comments.map((existingComment) => {
                        if (existingComment._id === comment._id) {
                            return {
                                ...existingComment,
                                replies: [...existingComment.replies, newReply],
                            };
                        }
                        return existingComment;
                    });
                    return {
                        ...post,
                        comments: updatedComments,
                    };
                }
                return post;
            });
            setPosts(updatedPosts);
            showToast('Success', 'Reply post successfully', 'success');
            setReply('');
        } catch (error) {
            return showToast('Error', error, 'error');
        } finally {
            setIsReplying(false);
        }
    };

    const handleDeleteReply = async (e) => {
        setLoading(true);
        const replyId = e.target.getAttribute('data-reply-id');
        try {
            if (!window.confirm('Are you sure you want to delete this post?')) return;
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;

            const res = await fetch(`/api/comment/delete/${comment._id}/reply/${replyId}`, {
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
            const updatedPosts = posts.map((post) => {
                if (post._id === comment.postId) {
                    const updatedComments = post.comments.map((c) => {
                        if (c._id === comment._id) {
                            const updatedReplies = c.replies.filter((reply) => reply._id !== replyId);
                            return {
                                ...c,
                                replies: updatedReplies,
                            };
                        }
                        return c;
                    });
                    return {
                        ...post,
                        comments: updatedComments,
                    };
                }
                return post;
            });

            setPosts(updatedPosts);
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Flex justifyContent={'start'} flexDirection={'column'} width={'100%'}>
                <Flex flexDirection="column">
                    <Flex gap={7} my={2} alignItems={'center'} onClick={(e) => e.preventDefault()}>
                        <Flex alignItems="center" gap={2} cursor="pointer" onClick={handleLikedComment}>
                            <svg
                                aria-label="Like"
                                color={liked ? 'rgb(237, 73, 86)' : ''}
                                fill={liked ? 'rgb(237, 73, 86)' : 'transparent'}
                                height="19"
                                role="img"
                                viewBox="0 0 24 22"
                                width="20"
                                cursor={'pointer'}
                            >
                                <path
                                    d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                ></path>
                            </svg>
                            <Text color={'gray.light'} fontSize={'sm'} cursor={'pointer'}>
                                {comment?.likes.length}
                            </Text>
                        </Flex>

                        <Flex alignItems="center" gap={2} cursor="pointer" onClick={handleCommentClick}>
                            <svg
                                aria-label="Comment"
                                color=""
                                fill=""
                                height="20"
                                role="img"
                                viewBox="0 0 24 24"
                                width="20"
                            >
                                <title>Comment</title>
                                <path
                                    d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                ></path>
                            </svg>
                            <Text color={'gray.light'} fontSize={'sm'}>
                                {comment?.replies.length}
                            </Text>
                        </Flex>

                        <RepostSVG />
                        <ShareSVG />
                    </Flex>
                </Flex>
                {/* Input comment */}
                {showTextarea && (
                    <Box borderRadius="md" minWidth={'528px'} marginTop={'8px'} onClick={(e) => e.preventDefault()}>
                        <Flex gap={3} alignItems="center" justifyContent={'space-between'} w="100%">
                            <Textarea
                                ref={inputRef}
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Bình luận với vai trò ${user?.userData?.username || user?.username}...`}
                                _placeholder={{ color: 'gray.400' }}
                                height={'36px'}
                                minHeight={'36px'}
                                padding={'8px'}
                                flex="1"
                                border={'none'}
                                boxShadow={'none'}
                                lineHeight="short"
                                width={'100%'}
                                _focus={{
                                    border: 'none !important', // Tắt border khi focus
                                    boxShadow: 'none !important', // Tắt shadow khi focus
                                }}
                                resize="none"
                                overflow="hidden"
                            />
                            <Button onClick={handleReplyComment}>Post</Button>
                        </Flex>
                    </Box>
                )}

                {comment.replies.map((reply) => (
                    <Flex gap={4} py={2} my={4} w={'full'} key={reply._id}>
                        <Avatar src={reply?.avatar} size={'sm'} />
                        <Flex gap={1} w={'full'} flexDirection={'column'}>
                            <Flex w={'full'} justifyContent={'space-between'} align={'center'}>
                                <Flex alignItems={'center'}>
                                    <Text fontSize={'sm'} fontWeight={'bold'}>
                                        {reply?.username}
                                    </Text>
                                    <Text fontSize={'sm'} color={'gray.light'} marginLeft={'8px'}>
                                        {formatDistanceToNow(new Date(reply?.createdAt))}
                                    </Text>
                                </Flex>
                                <Flex gap={2} alignItems={'center'}>
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
                                                    {currentUser?.userData?._id ===
                                                        (comment?.userId?._id || comment?.userId) && (
                                                        <>
                                                            <Divider />
                                                            {/* <MenuItem
                                                                // isLoading={loading}
                                                                data-reply-id={reply._id}
                                                                onClick={handleDeleteReply}
                                                                display="flex"
                                                                justifyContent="space-between"
                                                                padding={'12px'}
                                                                color={'red'}
                                                            >
                                                                Delete
                                                                <DeleteSVG />
                                                            </MenuItem> */}
                                                            <MenuItem
                                                                data-reply-id={reply._id}
                                                                onClick={handleDeleteReply}
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
                            <Text marginTop={'-8px'}>{reply?.textComment}</Text>
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </>
    );
};

export default ActionsHomePostComponent;

const RepostSVG = () => {
    return (
        <svg
            aria-label="Repost"
            color="currentColor"
            fill="currentColor"
            height="20"
            role="img"
            viewBox="0 0 24 24"
            width="20"
        >
            <title>Repost</title>
            <path
                fill=""
                d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
            ></path>
        </svg>
    );
};

const ShareSVG = () => {
    return (
        <svg
            aria-label="Share"
            color=""
            fill="rgb(243, 245, 247)"
            height="20"
            role="img"
            viewBox="0 0 24 24"
            width="20"
        >
            <title>Share</title>
            <line
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="22"
                x2="9.218"
                y1="3"
                y2="10.083"
            ></line>
            <polygon
                fill="none"
                points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
            ></polygon>
        </svg>
    );
};

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
