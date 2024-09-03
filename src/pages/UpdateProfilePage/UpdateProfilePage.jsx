import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import userAtom from '../../atoms/userAtom';
import { useRecoilState } from 'recoil';
import usePreviewImg from '../../hooks/usePreviewImg';
import useShowToast from '../../hooks/useShowToast';
import { Link, useNavigate } from 'react-router-dom';

const UpdateProfilePage = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        name: user.userData?.name,
        username: user.userData?.username,
        email: user.userData?.email,
        bio: user.userData?.bio,
        password: '',
    });
    const fileRef = useRef(null);

    const { handleImgChange, imgUrl } = usePreviewImg();
    const showToast = useShowToast();
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updating) return;
        setUpdating(true);
        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch(`/api/user/updateInfoFromUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    ...inputs,
                    avatar: imgUrl,
                }),
            });
            const data = await res.json();
            if (!data.success) {
                showToast('Error', 'Update info failed', 'error');
                return;
            }

            const updatedUser = {
                ...userLogin.userData, // Retain the current info user
                ...data.user,
            };

            const newUpdatedUser = {
                success: data.success,
                message: data.message || 'Update successful',
                accessToken: userLogin.accessToken, // Retain accessToken
                userData: updatedUser, // Update info user
            };

            localStorage.setItem('userLogin', JSON.stringify(newUpdatedUser));
            showToast('Success', 'Update info successfully', 'success');
            setUser(newUpdatedUser.userData);
            console.log('newUpdatedUser.userData: ', newUpdatedUser.userData);
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Flex align={'center'} justify={'center'} bg={useColorModeValue('white', 'gray.dark')} my={6}>
                    <Stack
                        spacing={4}
                        w={'full'}
                        maxW={'md'}
                        bg={useColorModeValue('white', 'gray.700')}
                        rounded={'xl'}
                        boxShadow={'lg'}
                        p={6}
                        my={12}
                    >
                        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                            User Profile Edit
                        </Heading>
                        <FormControl id="userName">
                            <Stack direction={['column', 'row']} spacing={6}>
                                <Center>
                                    <Avatar
                                        size="xl"
                                        boxShadow={'md'}
                                        src={imgUrl || user.avatar || user.userData.avatar}
                                    />
                                </Center>
                                <Center w="full">
                                    <Button
                                        w="full"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            return fileRef.current.click();
                                        }}
                                    >
                                        Change Avatar
                                    </Button>
                                    <Input type="file" hidden ref={fileRef} onChange={handleImgChange} />
                                </Center>
                            </Stack>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Fullname</FormLabel>
                            <Input
                                value={inputs.name}
                                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                                placeholder="Tam Soul"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input
                                value={inputs.username}
                                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                                placeholder="tamsoul"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                value={inputs.email}
                                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                                placeholder="your-email@example.com"
                                _placeholder={{ color: 'gray.500' }}
                                type="email"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Bio</FormLabel>
                            <Input
                                value={inputs.bio}
                                onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                                placeholder="Your bio"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                            />
                        </FormControl>
                        {/* <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                                value={inputs.password}
                                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                placeholder="Your password"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                            />
                        </FormControl> */}
                        <Stack spacing={6} direction={['column', 'row']}>
                            <Button
                                bg={'red.400'}
                                color={'white'}
                                w="full"
                                _hover={{
                                    bg: 'red.500',
                                }}
                                onClick={() => navigate(-1)}
                            >
                                <Link>Cancel</Link>
                            </Button>
                            <Button
                                bg={'green.400'}
                                color={'white'}
                                w="full"
                                _hover={{
                                    bg: 'green.500',
                                }}
                                type="submit"
                                isLoading={updating}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Stack>
                </Flex>
            </form>
        </div>
    );
};

export default UpdateProfilePage;
