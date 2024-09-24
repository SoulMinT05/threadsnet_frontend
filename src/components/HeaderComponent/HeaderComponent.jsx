import { Menu, MenuButton, MenuList, MenuItem, Text, Box, Flex } from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import './HeaderComponent.scss';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';

const HeaderComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useRecoilValue(userAtom);

    const getTitle = () => {
        switch (location.pathname) {
            case '/':
                return 'For you';
            case '/following':
                return 'Following';
            case '/liked':
                return 'Liked';
            case '/saved':
                return 'Saved';
            default:
                if (location.pathname === `/${user?.userData?.username}`) {
                    return 'Profile';
                }
                // else if (location.pathname === '/blockedList') {
                //     return 'Blocked List';
                // }
                // else if(location.pathname === `/${user?.userData?.username}/post/${post?.userData?.username}`) {
                //     return post.userData.username;
                // }
                return 'Menu';
        }
    };

    const isCurrentPage = (path) => location.pathname === path;
    if (location.pathname === `/${user?.userData?.username}`) {
        return (
            <Box display="flex" justifyContent="center" mt="16px">
                <Text fontSize="lg" fontWeight="bold">
                    Profile
                </Text>
            </Box>
        );
    } else if (location.pathname === '/blockedList') {
        return (
            <Box display="flex" justifyContent="center" mt="16px">
                <Text fontSize="lg" fontWeight="bold">
                    Blocked List
                </Text>
            </Box>
        );
    } else if (location.pathname === '/changePassword') {
        return (
            <Box display="flex" justifyContent="center" mt="16px">
                <Text fontSize="lg" fontWeight="bold">
                    Change password
                </Text>
            </Box>
        );
    } else if (location.pathname === '/updateProfile') {
        return (
            <Box display="flex" justifyContent="center" mt="16px">
                <Text fontSize="lg" fontWeight="bold">
                    Update profile
                </Text>
            </Box>
        );
    } else if (location.pathname === '/login') {
        return (
            <Box display="flex" justifyContent="center" mt="16px">
                <Text fontSize="lg" fontWeight="bold">
                    Login
                </Text>
            </Box>
        );
    } else if (location.pathname === '/register') {
        return (
            <Box display="flex" justifyContent="center" mt="16px">
                <Text fontSize="lg" fontWeight="bold">
                    Sign up
                </Text>
            </Box>
        );
    } else if (location.pathname === '/forgotPassword') {
        return (
            <Box display="flex" justifyContent="center" mt="16px">
                <Text fontSize="lg" fontWeight="bold">
                    Forgot password
                </Text>
            </Box>
        );
    } else if (location.pathname.includes('/resetPassword')) {
        return (
            <Box display="flex" justifyContent="center" mt="16px">
                <Text fontSize="lg" fontWeight="bold">
                    Reset password
                </Text>
            </Box>
        );
    }

    return (
        <Flex justifyContent="space-between" alignItems="center" width={'640px'}>
            <Box flex={1} display="flex" justifyContent="center" mt="16px" width={'640px'}>
                <Menu>
                    <MenuButton
                        as={Text}
                        cursor="pointer"
                        fontSize="lg"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                    >
                        {getTitle()} <ChevronDownIcon ml={2} />
                    </MenuButton>
                    <MenuList style={{ transform: 'translate3d(428px, 51px, 0px)' }}>
                        <MenuItem
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            minHeight={'26px'}
                            padding={'12px'}
                            // fontWeight={'bold'}
                            onClick={() => navigate('/')}
                        >
                            For you {isCurrentPage('/') && <CheckIcon ml={2} />} {/* Tick */}
                        </MenuItem>
                        <MenuItem
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            minHeight={'26px'}
                            padding={'12px'}
                            // fontWeight={'bold'}
                            onClick={() => navigate('/following')}
                        >
                            Following {isCurrentPage('/following') && <CheckIcon ml={2} />}
                        </MenuItem>
                        <MenuItem
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            minHeight={'26px'}
                            padding={'12px'}
                            // fontWeight={'bold'}
                            onClick={() => navigate('/liked')}
                        >
                            Liked {isCurrentPage('/liked') && <CheckIcon ml={2} />}
                        </MenuItem>
                        <MenuItem
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            minHeight={'26px'}
                            padding={'12px'}
                            // fontWeight={'bold'}
                            onClick={() => navigate('/saved')}
                        >
                            Saved {isCurrentPage('/saved') && <CheckIcon ml={2} />}
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>
            {user && (
                <Flex alignItems={'center'} gap={4} mt="16px">
                    {/* <Link as={RouterLink} to={`/${user.username}`}>
                        <RxAvatar size={24} />
                    </Link> */}
                    {/* <Link as={RouterLink} to={`/chat`}>
                        <BsFillChatQuoteFill size={20} />
                    </Link>
                    <Link as={RouterLink} to={`/settings`}>
                        <MdOutlineSettings size={20} />
                    </Link> */}
                    {/* <Button size={'xs'}>
                        <FiLogOut size={20} onClick={logout} />
                    </Button> */}
                </Flex>
            )}
        </Flex>
    );
};

export default HeaderComponent;
