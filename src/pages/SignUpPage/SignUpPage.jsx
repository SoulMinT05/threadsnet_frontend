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

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
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
                                        <Input type="text" />
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Username</FormLabel>
                                        <Input type="text" />
                                    </FormControl>
                                </Box>
                            </HStack>
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
                                    Sign up
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Already a user? <Link color={'blue.400'}>Login</Link>
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
