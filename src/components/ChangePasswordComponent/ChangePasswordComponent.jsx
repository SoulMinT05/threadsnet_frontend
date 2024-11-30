import { Button, Flex, FormControl, FormLabel, Input, Stack, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import userAtom from '../../atoms/userAtom';
import { useRecoilState } from 'recoil';
import useShowToast from '../../hooks/useShowToast';
import { Link, useNavigate } from 'react-router-dom';

const ChangePasswordComponent = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        currentPassword: '',
        newPassword: '',
    });

    const showToast = useShowToast();
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updating) return;
        setUpdating(true);
        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;

            const res = await fetch(`/api/user/changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    currentPassword: inputs.currentPassword,
                    newPassword: inputs.newPassword,
                }),
            });
            const data = await res.json();
            console.log('dataChangePasw: ', data);
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }

            showToast('Success', 'Changed password successfully', 'success');
            navigate(`/${user.userData.username}`);
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
                    <Stack spacing={4} w={'full'} maxW={'md'} rounded={'xl'} boxShadow={'lg'} p={6} my={'16px'}>
                        <FormControl>
                            <FormLabel>Current password</FormLabel>
                            <Input
                                value={inputs.currentPassword}
                                onChange={(e) => setInputs({ ...inputs, currentPassword: e.target.value })}
                                _placeholder={{ color: 'gray.500' }}
                                type="password"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>New password</FormLabel>
                            <Input
                                value={inputs.newPassword}
                                onChange={(e) => setInputs({ ...inputs, newPassword: e.target.value })}
                                _placeholder={{ color: 'gray.500' }}
                                type="password"
                            />
                        </FormControl>

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
                                bg={'blue.400'}
                                color={'white'}
                                w="full"
                                _hover={{
                                    bg: 'blue.500',
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

export default ChangePasswordComponent;
