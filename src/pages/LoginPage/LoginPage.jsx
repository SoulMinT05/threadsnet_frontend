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
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
            <Flex align={'center'} justify={'center'}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'} textAlign={'center'}>
                            Login
                        </Heading>
                    </Stack>
                    <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.dark')} boxShadow={'lg'} p={8}>
                        <Stack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input type={showPassword ? 'text' : 'password'} />
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
                                >
                                    Login
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Don&apost have account? Create an account <Link color={'blue.400'}>Register</Link>
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

export default LoginPage;
