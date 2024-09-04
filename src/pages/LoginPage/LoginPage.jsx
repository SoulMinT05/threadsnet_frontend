import React from 'react';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useShowToast from '../../hooks/useShowToast';
import { useSetRecoilState } from 'recoil';
import userAtom from '../../atoms/userAtom';

const LoginPage = () => {
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const navigateRegister = () => {
        navigate('/register');
    };
    const [loading, setLoading] = useState(false);
    const [inputsLogin, setInputsLogin] = useState({
        email: '',
        password: '',
    });
    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputsLogin),
            });
            const data = await res.json();
            console.log('data: ', data);
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }
            console.log('data: ', data);
            localStorage.setItem('userLogin', JSON.stringify(data));
            setUser(data);
            showToast('Success', 'Login successfully', 'success');
            navigate('/');
        } catch (err) {
            console.log('err: ', err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Flex align={'center'} justify={'center'}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'} textAlign={'center'}>
                            Login
                        </Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.dark')}
                        boxShadow={'lg'}
                        p={8}
                        w={{
                            base: 'full',
                            sm: '400px',
                        }}
                    >
                        <Stack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    onChange={(e) => setInputsLogin({ ...inputsLogin, email: e.target.value })}
                                    value={inputsLogin.email}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(e) => setInputsLogin({ ...inputsLogin, password: e.target.value })}
                                        value={inputsLogin.password}
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
                                    onClick={handleLogin}
                                    isLoading={loading}
                                >
                                    Login
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Don&apos;t have account?{' '}
                                    <Link color={'blue.400'} onClick={navigateRegister}>
                                        Register
                                    </Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    );
};

export default LoginPage;
