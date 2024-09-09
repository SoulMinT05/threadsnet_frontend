import { Menu, MenuButton, MenuList, MenuItem, Text, Box } from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
    }

    return (
        <Box display="flex" justifyContent="center" mt="16px">
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
    );
};

export default HeaderComponent;
