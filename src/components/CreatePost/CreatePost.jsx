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
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import TextArea from 'antd/es/input/TextArea';
import { useRef, useState } from 'react';
import usePreviewImg from '../../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import useShowToast from '../../hooks/useShowToast';

const MAX_CHAR = 500;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState('');
    const imgRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();

    const { handleImgChange, imgUrl, setImgUrl } = usePreviewImg();
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
        const userLogin = JSON.parse(localStorage.getItem('userLogin'));
        const accessToken = userLogin?.accessToken;

        const res = await fetch(`/api/post/createPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                postedBy: user.userData._id,
                text: postText,
                image: imgUrl,
            }),
        });
        const data = await res.json();
        console.log('data: ', data);
        console.log({
            postedBy: user.userData._id,
            text: postText,
            image: imgUrl, // Kiểm tra imgUrl trước khi gửi request
        });
        if (!data.success) {
            showToast('Error', data.message, 'error');
            return;
        }
        showToast('Success', 'Created post successfully', 'success');
        onClose();
    };
    return (
        <>
            <Button
                position={'fixed'}
                bottom={10}
                right={5}
                bg={useColorModeValue('gray.300', 'gray.dark')}
                size={{ base: 'sm', sm: 'md' }}
                onClick={onOpen}
            >
                <AddIcon />
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <TextArea placeholder="Post content go here" onChange={handleTextChange} value={postText} />
                            <Text fontSize={'xs'} fontWeight={'bold'} textAlign={'right'} m={'1'} color={'gray.800'}>
                                {remainingChar} / {MAX_CHAR}
                            </Text>
                            <Input type="file" hidden ref={imgRef} onChange={handleImgChange} />
                            <BsFillImageFill
                                style={{ marginLeft: '5px', cursor: 'pointer' }}
                                size={16}
                                onClick={() => imgRef.current.click()}
                            />
                        </FormControl>
                        {imgUrl && (
                            <Flex mt={5} w={'full'} position={'relative'}>
                                <Image src={imgUrl} alt="Selected img" />
                                <CloseButton
                                    onClick={() => setImgUrl('')}
                                    bg={'gray.800'}
                                    position={'absolute'}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleCreatePost}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;
