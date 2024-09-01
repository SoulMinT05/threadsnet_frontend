import { Flex, Image, useColorMode } from '@chakra-ui/react';
// import { Dropdown } from 'antd';
// import { Col, Row } from 'antd';

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <>
            {/* <Image
                cursor={'pointer'}
                alt="logo"
                w={6}
                src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
            /> */}
            <Flex justifyContent={'center'} style={{ margin: '8px' }}>
                <Image
                    cursor={'pointer'}
                    alt="logo"
                    w={6}
                    src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
                    onClick={toggleColorMode}
                />
            </Flex>
        </>
    );
};

export default Header;
