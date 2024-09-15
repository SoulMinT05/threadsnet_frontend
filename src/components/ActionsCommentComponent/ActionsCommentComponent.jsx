import { Box, Button, Flex, Text, Textarea } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import commentAtom from '../../atoms/commentAtom';
import useShowToast from '../../hooks/useShowToast';
import postAtom from '../../atoms/postAtom';
const ActionsHomePostComponent = ({ comment }) => {
    //destructuring: post_ is object copied from post
    const userByAtom = useRecoilValue(userAtom);
    const user = userByAtom?.userData;
    const [liked, setLiked] = useState(comment.likes.includes(user?._id)); //problem

    const [posts, setPosts] = useRecoilState(postAtom);

    const [comments, setComments] = useRecoilState(commentAtom);
    // const [comments, setComments] = useRecoilState();
    console.log('postsActionsCOmment: ', posts);
    console.log('commentsActionsCOmment: ', comments);
    const [isLiking, setIsLiking] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState('');
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
        if (inputRef.current) {
            inputRef.current.focus(); // Focus vào input khi nhấn vào icon comment
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleReply();
        }
    };
    const handleReply = async () => {
        if (!user) {
            return showToast('Error', 'You need to be logged in to reply', 'error');
        }
        if (isReplying) return;
        setIsReplying(true);
        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch('/api/comment/' + post._id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify({
                    textComment: comment,
                }),
            });
            const data = await res.json();
            console.log('dataActionsHome: ', data);
            if (!data.success) return showToast('Error', data.message, 'error');
            const updatedComments = posts?.map((p) => {
                if (p._id === post._id) {
                    return {
                        ...p,
                        comments: [...p.comments, data.newComment],
                    };
                }
                return p;
            });

            setComments(updatedComments);
            showToast('Success', 'Reply post successfully', 'success');
            setReply('');
        } catch (error) {
            return showToast('Error', error, 'error');
        } finally {
            setIsReplying(false);
        }
    };
    return (
        <>
            <Flex justifyContent={'start'} flexDirection={'column'} width={'100%'}>
                <Flex flexDirection="column">
                    <Flex gap={7} my={2} alignItems={'center'} onClick={(e) => e.preventDefault()}>
                        <svg
                            aria-label="Like"
                            color={liked ? 'rgb(237, 73, 86)' : ''}
                            fill={liked ? 'rgb(237, 73, 86)' : 'transparent'}
                            height="19"
                            role="img"
                            viewBox="0 0 24 22"
                            width="20"
                            cursor={'pointer'}
                            onClick={handleLikedComment}
                        >
                            <path
                                d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                                stroke="currentColor"
                                strokeWidth="2"
                            ></path>
                        </svg>
                        <Text
                            color={'gray.light'}
                            fontSize={'sm'}
                            style={{ marginLeft: '-22px' }}
                            cursor={'pointer'}
                            onClick={handleLikedComment}
                        >
                            {comment?.likes.length}
                        </Text>

                        <svg
                            aria-label="Comment"
                            color=""
                            fill=""
                            height="20"
                            role="img"
                            viewBox="0 0 24 24"
                            width="20"
                            onClick={handleCommentClick}
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
                        <Text color={'gray.light'} fontSize={'sm'} style={{ marginLeft: '-22px' }}>
                            {comment?.replies.length}
                        </Text>

                        <RepostSVG />
                        <ShareSVG />
                    </Flex>
                </Flex>
                {/* Input comment */}
                <Box borderRadius="md" minWidth={'528px'} marginTop={'8px'} onClick={(e) => e.preventDefault()}>
                    <Flex gap={3} alignItems="center" justifyContent={'space-between'} w="100%">
                        <Textarea
                            ref={inputRef}
                            value={comment}
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
                        />
                        <Button onClick={handleReply}>Post</Button>
                    </Flex>
                </Box>
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
