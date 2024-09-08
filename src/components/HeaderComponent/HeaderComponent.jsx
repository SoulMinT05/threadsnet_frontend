import { Menu, MenuButton, MenuList, MenuItem, Text, Box } from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './HeaderComponent.scss';

const YourComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
                return 'Menu'; // Tiêu đề mặc định
        }
    };

    const isCurrentPage = (path) => location.pathname === path;

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

export default YourComponent;
