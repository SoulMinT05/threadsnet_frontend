import { Button, Flex, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useShowToast from '../../hooks/useShowToast';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const { token } = useParams();
    const handleResetPassword = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/resetPassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            console.log('dataResetPassword: ', data);

            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }
            showToast('Success', data.message, 'success');
            navigate('/login');
        } catch (err) {
            console.log('err: ', err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Flex
            minH={'24vh'}
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
                <FormControl id="password">
                    <FormLabel>Enter new password</FormLabel>
                    <Input value={password} onChange={(e) => setPassword(e.target.value)} type="text" />
                </FormControl>
                <Stack spacing={6}>
                    <Button
                        isLoading={loading}
                        onClick={handleResetPassword}
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                    >
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    );
};

export default ResetPasswordPage;
