import React from 'react';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useShowToast from '../../hooks/useShowToast';
import { useSetRecoilState } from 'recoil';
import userAtom from '../../atoms/userAtom';

const SignUpPage = () => {
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const navigateLogin = () => {
        navigate('/login');
    };
    const [inputsRegister, setInputsRegister] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });
    const handleRegister = async () => {
        try {
            const res = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputsRegister),
            });
            const data = await res.json();
            console.log('data: ', data);
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }
            console.log('data: ', data);
            showToast('Success', 'Register successfully', 'success');
            navigate('/login');
        } catch (err) {
            console.log('err: ', err);
        }
    };
    return (
        <>
            <Flex align={'center'} justify={'center'}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'} textAlign={'center'}>
                            Sign up
                        </Heading>
                    </Stack>
                    <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.dark')} boxShadow={'lg'} p={8}>
                        <Stack spacing={4}>
                            <HStack>
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Full name</FormLabel>
                                        <Input
                                            type="text"
                                            onChange={(e) =>
                                                setInputsRegister({ ...inputsRegister, name: e.target.value })
                                            }
                                            value={inputsRegister.name}
                                        />
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Username</FormLabel>
                                        <Input
                                            type="text"
                                            onChange={(e) =>
                                                setInputsRegister({ ...inputsRegister, username: e.target.value })
                                            }
                                            value={inputsRegister.username}
                                        />
                                    </FormControl>
                                </Box>
                            </HStack>
                            <FormControl isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    onChange={(e) => setInputsRegister({ ...inputsRegister, email: e.target.value })}
                                    value={inputsRegister.email}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(e) =>
                                            setInputsRegister({ ...inputsRegister, password: e.target.value })
                                        }
                                        value={inputsRegister.password}
                                    />
                                    <InputRightElement h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}
                                        >
                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={useColorModeValue('gray.600', 'gray.700')}
                                    color={'white'}
                                    _hover={{
                                        bg: useColorModeValue('gray.700', 'gray.800'),
                                    }}
                                    onClick={handleRegister}
                                >
                                    Sign up
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Already a user?{' '}
                                    <Link color={'blue.400'} onClick={navigateLogin}>
                                        Login
                                    </Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
            <h1>Aith</h1>
        </>
    );
};

export default SignUpPage;
