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
import { useParams } from 'react-router-dom';
import usePreviewImg from '../../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState('');
    const imgRef = useRef(null);

    const { handleImgChange, imgUrl, setImgUrl } = usePreviewImg();
    const handleTextChange = () => {};
    const handleCreatePost = () => {};
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
                                500/500
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
