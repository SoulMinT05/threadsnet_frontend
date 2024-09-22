import {
    Avatar,
    Box,
    Button,
    Flex,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Text,
    VStack,
} from '@chakra-ui/react';
// import { Link } from 'react-router-dom';
import './ProfileInfoComponent.scss';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useToast } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import userAtom from '../../atoms/userAtom';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useShowToast from '../../hooks/useShowToast';

const ProfileInfoComponent = ({ user }) => {
    const toast = useToast();

    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useRecoilState(userAtom);
    // user: username in params
    // currentUser: user in localStorage
    const [following, setFollowing] = useState(user.followers.includes(currentUser?.userData?._id));
    const showToast = useShowToast();
    const [updating, setUpdating] = useState(false);
    const [updatingBlock, setUpdatingBlock] = useState(false);

    const handleFollow = async () => {
        if (!currentUser) {
            showToast('Error', 'Please login to follow', 'error');
            return;
        }
        if (updating) return;
        setUpdating(true);
        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch(`/api/user/follow/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }
            setFollowing(!following);
            // 2 user unfollow
            // true: followed --> unfollow
            // false: unfollowed --> follow
            if (following) {
                showToast('Success', `Unfollow ${user.name}`, 'success');
                user.followers.pop();
            } else {
                showToast('Success', `Follow ${user.name}`, 'success');
                user.followers.push(currentUser?._id);
            }
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleBlock = async () => {
        if (!currentUser) {
            showToast('Error', 'Please login to follow', 'error');
            return;
        }
        if (updatingBlock) return;
        setUpdatingBlock(true);
        try {
            if (
                !window.confirm(
                    'Are you sure you want to delete this post? You cannot see them posts after blocking them',
                )
            )
                return;
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch(`/api/user/blocked/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }

            const updatedUserLogin = {
                ...userLogin,
                userData: data.response,
                success: data.success,
                message: data.message,
                accessToken: userLogin.accessToken,
            };
            localStorage.setItem('userLogin', JSON.stringify(updatedUserLogin));
            setCurrentUser(updatedUserLogin);
            showToast('Success', data.message, 'success');
            navigate('/blockedList');
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setUpdatingBlock(false);
        }
    };

    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard
            .writeText(currentURL)
            .then(() => {
                toast({
                    // title: 'Account created.',
                    description: 'Copied link successfully',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
            })
            .catch((error) => {
                showToast('Error', error, 'error');
            });
    };

    return (
        <VStack gap={4} alignItems={'start'}>
            <Flex justifyContent={'space-between'} w={'full'}>
                <Box>
                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'}>{user.username}</Text>
                        <Text fontSize={'xs'} bg={'gray.dark'} color={'gray.light'} p={1} borderRadius={'full'}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        name={user.name}
                        src={user.avatar}
                        size={{
                            base: 'md',
                            md: 'xl',
                        }}
                    />
                </Box>
            </Flex>
            <Text>{user.bio}</Text>
            {currentUser?.userData?._id === user._id && (
                <Flex alignItems={'center'} justifyContent={'space-between'} width={'full'}>
                    <Link as={RouterLink} to="/updateProfile">
                        <Button size={'sm'}>Update profile</Button>
                    </Link>
                    <Link as={RouterLink} to="/changePassword">
                        <Button size={'sm'}>Change password</Button>
                    </Link>
                </Flex>
            )}
            <Flex alignItems={'center'} justifyContent={'space-between'} width={'full'}>
                {currentUser?.userData?._id !== user._id && (
                    <Button size={'sm'} onClick={handleFollow} isLoading={updating}>
                        {following ? 'Unfollow' : 'Follow'}
                    </Button>
                )}

                {currentUser?.userData?._id !== user._id && (
                    <Button size={'sm'} onClick={handleBlock} colorScheme="red" isLoading={updatingBlock}>
                        Block
                    </Button>
                )}
            </Flex>

            <Flex w={'full'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>{user.followers.length ? user.followers.length : 0} followers</Text>
                    <Box w="1" h="1" bg={'gray.light'} borderRadius={'full'}></Box>
                    <Link color={'gray.light'}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={'pointer'} />
                    </Box>
                    <Box className="icon-container">
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={'pointer'} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={'gray.dark'}>
                                    <MenuItem bg={'gray.dark'} onClick={copyURL}>
                                        Copy link
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>

            <Flex w={'full'}>
                <Flex flex={1} borderBottom={'1.5px solid white'} justifyContent={'center'} pb={3} cursor={'pointer'}>
                    <Text fontWeight={'bold'}>Threads</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={'1px solid gray'}
                    justifyContent={'center'}
                    color={'gray.light'}
                    pb={3}
                    cursor={'pointer'}
                >
                    <Text fontWeight={'bold'}>Comments</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={'1px solid gray'}
                    justifyContent={'center'}
                    color={'gray.light'}
                    pb={3}
                    cursor={'pointer'}
                >
                    <Text fontWeight={'bold'}>Reposts</Text>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default ProfileInfoComponent;
