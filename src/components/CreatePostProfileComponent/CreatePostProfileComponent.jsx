import { AddIcon } from '@chakra-ui/icons';
import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    Divider,
    useDisclosure,
    Select,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import usePreviewImg from '../../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import useShowToast from '../../hooks/useShowToast';
import postAtom from '../../atoms/postAtom';
import { useParams } from 'react-router-dom';

const MAX_CHAR = 500;

const CreatePostProfileComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState('');
    const [visibility, setVisibility] = useState('public');
    const imgRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postAtom);
    const showToast = useShowToast();
    const { username } = useParams();

    const { handleImgChange, imgUrl, setImgUrl } = usePreviewImg();
    const [loading, setLoading] = useState(false);
    const handleVisibilityChange = (e) => {
        setVisibility(e.target.value);
    };
    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleCreatePost = async () => {
        setLoading(true);
        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;

            const res = await fetch(`/api/post/createPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    postedBy: user?.userData._id || user?._id,
                    text: postText,
                    image: imgUrl,
                    visibility: visibility || 'public',
                }),
            });
            const data = await res.json();
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }
            showToast('Success', 'Created post successfully', 'success');
            if (username === user.userData.username) {
                setPosts((prevPosts) => {
                    return [data.newPost, ...prevPosts];
                });
            }
            onClose();
            setPostText('');
            setImgUrl('');
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Text onClick={onOpen} opacity={'0.5'}>
                Start a post ...
            </Text>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                onCloseComplete={() => {
                    setPostText('');
                    setImgUrl('');
                    setVisibility('public');
                    setRemainingChar(MAX_CHAR);
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <Flex alignItems="center">
                        <ModalHeader flex={1} textAlign="center" fontSize="20px">
                            Create Post
                        </ModalHeader>
                        <ModalCloseButton marginTop={'8px'} />
                    </Flex>
                    <Divider />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                border={'none'}
                                boxShadow={'none'}
                                minHeight={'150px'}
                                placeholder="Post content go here"
                                onChange={handleTextChange}
                                value={postText}
                                p="0"
                                lineHeight="short"
                                _focus={{
                                    border: 'none !important', // Tắt border khi focus
                                    boxShadow: 'none !important', // Tắt shadow khi focus
                                }}
                                resize="none"
                            />
                            <Flex alignItems={'center'} justifyContent="space-between">
                                <Flex justifyContent="start">
                                    <Flex alignItems={'center'}>
                                        <Input type="file" hidden ref={imgRef} onChange={handleImgChange} />
                                        <BsFillImageFill
                                            style={{ marginLeft: '5px', cursor: 'pointer' }}
                                            size={16}
                                            onClick={() => imgRef.current.click()}
                                        />
                                    </Flex>
                                    <FormControl maxWidth="120px" ml="16px">
                                        <Select value={visibility} onChange={handleVisibilityChange}>
                                            <option value="public">Public</option>
                                            <option value="friends">Friends</option>
                                            <option value="followers">Followers</option>
                                            <option value="private">Private</option>
                                        </Select>
                                    </FormControl>
                                </Flex>
                                <Text fontSize={'xs'} fontWeight={'bold'}>
                                    {remainingChar} / {MAX_CHAR}
                                </Text>
                            </Flex>
                        </FormControl>
                        {imgUrl && (
                            <Flex mt={5} w={'full'} position={'relative'}>
                                <Image src={imgUrl} alt="Selected img" />
                                <CloseButton onClick={() => setImgUrl('')} position={'absolute'} top={2} right={2} />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            //  colorScheme="blue"
                            width="100%" // Đặt chiều rộng 100%
                            bg="gray.800" // Màu nền của nút giống màu nền của modal
                            color="white" // Màu chữ của nút
                            _hover={{ bg: 'gray.700' }}
                            _disabled={{
                                bg: 'gray.600',
                                color: 'gray.400',
                                cursor: 'not-allowed',
                                _hover: {
                                    bg: 'gray.600',
                                },
                            }}
                            onClick={handleCreatePost}
                            isLoading={loading}
                            isDisabled={!postText}
                        >
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePostProfileComponent;
