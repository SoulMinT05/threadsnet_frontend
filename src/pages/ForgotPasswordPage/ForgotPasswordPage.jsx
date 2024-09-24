import { Button, FormControl, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            console.log('dataForgotPassword: ', data);

            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }
            showToast('Success', data.message, 'success');
        } catch (err) {
            console.log('err: ', err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Flex
            minH={'40vh'}
            align={'center'}
            justify={'center'}
            // bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                // bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}
            >
                <Text
                    fontSize={{ base: 'sm', sm: 'md' }}
                    // color={useColorModeValue('gray.800', 'gray.400')}
                >
                    Enter your email
                </Text>
                <FormControl id="email">
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your-email@example.com"
                        _placeholder={{ color: 'gray.500' }}
                        type="email"
                    />
                </FormControl>
                <Stack spacing={6}>
                    <Flex justifyContent={'end'}>
                        <Button
                            onClick={() => navigate('/login')}
                            bg={'gray.400'}
                            color={'white'}
                            _hover={{
                                bg: 'gray.500',
                            }}
                            marginRight={'12px'}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleForgotPassword}
                            isLoading={loading}
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}
                        >
                            Submit
                        </Button>
                    </Flex>
                </Stack>
            </Stack>
        </Flex>
    );
};

export default ForgotPasswordPage;
