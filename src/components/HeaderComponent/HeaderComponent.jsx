import { Flex, Image, Link, useColorMode, Menu, MenuButton, MenuList, MenuItem, Text, Box } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';

import { ChevronDownIcon } from '@chakra-ui/icons';
// import { Dropdown } from 'antd';
// import { Col, Row } from 'antd';

const HeaderComponent = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const user = useRecoilValue(userAtom);
    const location = useLocation();
    console.log('location: ', location);

    const pageTitle = () => {
        if (location.pathname === '/') return 'For you';
        if (location.pathname === '/updateProfile') return 'Update Profile';
        // if (location.pathname.includes('/login')) return 'Login';
        // if (location.pathname.includes('/register')) return 'Register';
        if (location.pathname.includes('/:username')) return 'Profile';
        return '';
    };

    return (
        <>
            <Flex justifyContent="center" alignItems="center" px={4} py={2}>
                {/* <Flex alignItems="center">
                    {user && (
                        <Link as={RouterLink} to="/" mx={4}>
                            <AiFillHome size={24} />
                        </Link>
                    )}
                    <Image
                        cursor="pointer"
                        alt="logo"
                        w={8}
                        src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
                        onClick={toggleColorMode}
                    />
                </Flex> */}

                {/* Dropdown Menu */}
                {location.pathname === '/' ? (
                    <Menu>
                        <MenuButton
                            as={Text}
                            cursor="pointer"
                            fontSize="lg"
                            fontWeight="bold"
                            display="flex"
                            alignItems="center"
                        >
                            For you <ChevronDownIcon ml={2} />
                        </MenuButton>
                        <MenuList
                            //  bg="gray.700" color="white"
                            // bg="gray.800"
                            // color="white"
                            border="none"
                        >
                            <MenuItem
                                // _hover={{ bg: 'gray.800' }}
                                onClick={() => console.log('For you')}
                            >
                                For you
                            </MenuItem>
                            <MenuItem
                                // _hover={{ bg: 'gray.800' }}
                                onClick={() => console.log('Following')}
                            >
                                Following
                            </MenuItem>
                            <MenuItem
                                // _hover={{ bg: 'gray.800' }}
                                onClick={() => console.log('Liked')}
                            >
                                Liked
                            </MenuItem>
                            <MenuItem
                                // _hover={{ bg: 'gray.800' }}
                                onClick={() => console.log('Saved')}
                            >
                                Saved
                            </MenuItem>
                        </MenuList>
                    </Menu>
                ) : (
                    // Hiển thị tên trang khi không ở trang Home
                    <Text fontSize="lg" fontWeight="bold">
                        {pageTitle()}
                    </Text>
                )}
            </Flex>
        </>
    );
};

export default HeaderComponent;
