import { Flex, Icon, Link, Box, Image, useColorMode, IconButton } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaPlus, FaHeart, FaUser, FaRegCommentDots, FaThumbtack } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import { FaSun, FaMoon } from 'react-icons/fa';
import { BsFillSunFill } from 'react-icons/bs';

const SidebarComponent = () => {
    const navigate = useNavigate();
    const user = useRecoilValue(userAtom);
    const { colorMode, toggleColorMode } = useColorMode();

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
                <Link onClick={() => navigate('/')} _hover={{ textDecoration: 'none' }}>
                    <Icon as={FaHome} boxSize={6} mb="30px" />
                    {/* <AiFillHome size={24} /> */}
                </Link>
                <Link onClick={() => navigate('/search')} _hover={{ textDecoration: 'none' }}>
                    <Icon as={FaSearch} boxSize={6} mb="30px" />
                </Link>
                <Link onClick={() => navigate('/createPost')} _hover={{ textDecoration: 'none' }}>
                    <Icon as={FaPlus} boxSize={6} mb="30px" />
                </Link>
                <Link onClick={() => navigate('/favorites')} _hover={{ textDecoration: 'none' }}>
                    <Icon as={FaHeart} boxSize={6} mb="30px" />
                </Link>
                {/* <Link onClick={() => navigate('/profile')} _hover={{ textDecoration: 'none' }}> */}
                <Link as={RouterLink} to={`/${user.userData.username}`} _hover={{ textDecoration: 'none' }}>
                    <Icon as={FaUser} boxSize={6} mb="30px" />
                </Link>
            </Box>

            <Box>
                <Link onClick={() => navigate('/pins')} _hover={{ textDecoration: 'none' }}>
                    <Icon as={FaThumbtack} boxSize={6} mb="30px" />
                </Link>
                <IconButton
                    aria-label="Toggle color mode"
                    icon={colorMode === 'dark' ? <BsFillSunFill /> : <FaMoon />} // Thay đổi icon dựa trên colorMode
                    onClick={toggleColorMode}
                    variant="ghost"
                    fontSize="24px"
                    cursor="pointer"
                    boxSize={6}
                    mb="30px"
                    ml={'-8px'}
                />
            </Box>
        </Flex>
    );
};

export default SidebarComponent;
