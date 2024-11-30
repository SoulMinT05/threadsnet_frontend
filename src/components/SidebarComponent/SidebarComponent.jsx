import {
    Flex,
    Icon,
    Link,
    Box,
    useColorMode,
    IconButton,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaHome, FaHeart, FaUser } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import { FaMoon } from 'react-icons/fa';
import { BsFillSunFill } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import useLogout from '../../hooks/useLogout';

const SidebarComponent = () => {
    const navigate = useNavigate();
    const user = useRecoilValue(userAtom);
    const { colorMode, toggleColorMode } = useColorMode();
    const logout = useLogout();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Flex
            as="nav"
            direction="column"
            justify="space-between"
            height="100vh"
            width="80px"
            position="fixed"
            padding="20px"
        >
            <Box>
                {/* <Link onClick={() => navigate('/admin')} _hover={{ opacity: '0.6' }}>
                    <Icon as={MdDashboard} boxSize={6} mb="30px" />
                </Link> */}
                <Link onClick={() => navigate('/')} _hover={{ opacity: '0.6' }}>
                    <Icon as={FaHome} boxSize={6} mb="30px" />
                </Link>
                {/* <Link onClick={() => navigate('/search')} _hover={{ opacity: '0.6' }} marginBottom={'30px'}>
                    <SearchSVG />
                </Link> */}
                <Link onClick={() => navigate('/message')} _hover={{ opacity: '0.6' }} marginBottom={'30px'}>
                    <MessageSVG />
                </Link>
                <Link onClick={() => navigate('/notification')} _hover={{ opacity: '0.6' }}>
                    <Icon as={FaHeart} boxSize={6} mb="30px" />
                </Link>

                {user && (
                    <Link as={RouterLink} to={`/${user.userData?.username}`} _hover={{ opacity: '0.6' }}>
                        <Icon as={FaUser} boxSize={6} mb="30px" />
                    </Link>
                )}
            </Box>

            <Box>
                {/* <Popover isOpen={isOpen} onClose={onClose} zIndex={10}>
                    <PopoverTrigger onClick={isOpen ? onClose : onOpen}>
                        <Link onClick={isOpen ? onClose : onOpen} _hover={{ opacity: '0.6' }} marginBottom={'30px'}>
                            <MoreSVG />
                        </Link>
                    </PopoverTrigger>
                    <PopoverContent boxShadow="none" padding={'12px'} width={'266px'} zIndex={20}>
                        <PopoverBody zIndex={10}>
                            <Box>
                                <Flex
                                    alignItems={'center'}
                                    justifyContent={'start'}
                                    padding={'8px'}
                                    _hover={{ opacity: '0.6' }}
                                    cursor={'pointer'}
                                    onClick={onClose}
                                >
                                    <Link onClick={() => navigate('/blockedList')} _hover={{ opacity: '0.6' }}>
                                        <BlockSVG />
                                    </Link>
                                    <Text marginLeft={'16px'}>Blocked List</Text>
                                </Flex>
                                <Flex
                                    alignItems={'center'}
                                    justifyContent={'start'}
                                    padding={'8px'}
                                    _hover={{ opacity: '0.6' }}
                                    cursor={'pointer'}
                                >
                                    <IconButton
                                        aria-label="Toggle color mode"
                                        _hover={{ opacity: '0.6' }}
                                        icon={colorMode === 'dark' ? <BsFillSunFill /> : <FaMoon />} // Thay đổi icon dựa trên colorMode
                                        onClick={toggleColorMode}
                                        variant="ghost"
                                        fontSize="24px"
                                        cursor="pointer"
                                        // boxSize={6}
                                        // mb="30px"
                                        ml={'-8px'}
                                        _focus={{ boxShadow: 'none' }}
                                    />
                                    <Text marginLeft={'9px'}>Switch appearance</Text>
                                </Flex>
                            </Box>
                        </PopoverBody>
                        <PopoverFooter zIndex={10}>
                            <Flex
                                alignItems={'center'}
                                justifyContent={'start'}
                                padding={'8px'}
                                _hover={{ opacity: '0.6' }}
                                cursor={'pointer'}
                                onClick={onClose}
                            >
                                <Link onClick={logout} _hover={{ opacity: '0.6' }}>
                                    <Icon color={'red'} as={FiLogOut} boxSize={6} />
                                </Link>
                                <Text
                                    _hover={{ opacity: '0.6' }}
                                    cursor={'pointer'}
                                    marginLeft={'16px'}
                                    marginTop={'-6px'}
                                    color="red"
                                >
                                    Logout
                                </Text>
                            </Flex>
                        </PopoverFooter>
                    </PopoverContent>
                </Popover> */}

                <Link onClick={() => navigate('/blockedList')} _hover={{ opacity: '0.6' }}>
                    <BlockSVG />
                </Link>

                <IconButton
                    aria-label="Toggle color mode"
                    _hover={{ opacity: '0.6' }}
                    icon={colorMode === 'dark' ? <BsFillSunFill /> : <FaMoon />} // Thay đổi icon dựa trên colorMode
                    onClick={toggleColorMode}
                    variant="ghost"
                    fontSize="24px"
                    cursor="pointer"
                    boxSize={6}
                    mb="30px"
                    ml={'-8px'}
                />
                {/* <Link onClick={() => navigate('/settings')} _hover={{ opacity: '0.6' }} marginBottom={'30px'}>
                    <SettingSVG />
                </Link> */}
                {user && (
                    <Link onClick={logout} _hover={{ opacity: '0.6' }} marginBottom={'30px'}>
                        <Icon color={'red'} as={FiLogOut} boxSize={6} mb="30px" />
                    </Link>
                )}
            </Box>
        </Flex>
    );
};

export default SidebarComponent;

const HomeDarkSVG = () => {
    return (
        <svg
            aria-label="Threads"
            // fill="var(--barcelona-primary-icon)"
            fill="currentColor"
            height="100%"
            role="img"
            viewBox="0 0 192 192"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
        </svg>
    );
};

const SearchSVG = () => {
    return (
        <svg
            aria-label="Search"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
            style={{ marginBottom: '30px' }}
        >
            <title>Search</title>
            <path
                d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            ></path>
            <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="16.511"
                x2="22"
                y1="16.511"
                y2="22"
            ></line>
        </svg>
    );
};

const MessageSVG = () => {
    return (
        <svg
            aria-label="Direct"
            fill="currentColor"
            style={{ marginBottom: '30px' }}
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
        >
            <title>Direct</title>
            <line
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="22"
                x2="9.218"
                y1="3"
                y2="10.083"
            ></line>
            <polygon
                fill="none"
                points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
            ></polygon>
        </svg>
    );
};

const MoreSVG = () => {
    return (
        <svg
            aria-label="Settings"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
            style={{ marginBottom: '30px' }}
        >
            <title>Settings</title>
            <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="3"
                x2="21"
                y1="4"
                y2="4"
            ></line>
            <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="3"
                x2="21"
                y1="12"
                y2="12"
            ></line>
            <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="3"
                x2="21"
                y1="20"
                y2="20"
            ></line>
        </svg>
    );
};

const BlockSVG = () => {
    return (
        <svg
            aria-label=""
            fill="currentColor"
            height="24"
            role="img"
            style={{ marginBottom: '30px' }}
            viewBox="0 0 24 24"
            width="24"
        >
            <title></title>
            <path d="M20.153 20.106A11.493 11.493 0 0 0 3.893 3.858c-.007.007-.016.009-.023.016s-.009.016-.015.023a11.493 11.493 0 0 0 16.247 16.26c.01-.009.022-.012.03-.02.01-.01.012-.022.021-.031Zm1.348-8.102a9.451 9.451 0 0 1-2.119 5.968L6.033 4.622a9.49 9.49 0 0 1 15.468 7.382Zm-19 0a9.451 9.451 0 0 1 2.118-5.967l13.35 13.35A9.49 9.49 0 0 1 2.5 12.003Z"></path>
        </svg>
    );
};

const SettingSVG = () => {
    return (
        <svg
            aria-label="Settings"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
            style={{ marginBottom: '30px' }}
        >
            <title>Settings</title>
            <circle
                cx="12"
                cy="12"
                fill="none"
                r="8.635"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            ></circle>
            <path
                d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096"
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
            ></path>
        </svg>
    );
};
