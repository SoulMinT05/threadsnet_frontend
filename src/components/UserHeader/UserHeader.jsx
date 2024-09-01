import { Avatar, Box, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack } from '@chakra-ui/react';
import './UserHeader.scss';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useToast } from '@chakra-ui/react';

const UserHeader = () => {
    const toast = useToast();
    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard
            .writeText(currentURL)
            .then(() => {
                console.log('URL copied to clipboard');
                toast({
                    // title: 'Account created.',
                    description: 'Copied link successfully',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };
    return (
        <VStack gap={4} alignItems={'start'}>
            <Flex justifyContent={'space-between'} w={'full'}>
                <Box>
                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                        Mark Zuckebug
                    </Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'}>markzuckebug</Text>
                        <Text fontSize={'xs'} bg={'gray.dark'} color={'gray.light'} p={1} borderRadius={'full'}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        name="Mark Zuckebug"
                        src="./zuck-avatar.png"
                        size={{
                            base: 'md',
                            md: 'xl',
                        }}
                    />
                </Box>
            </Flex>
            <Text>Carefully selected #graphicdesign works and beyond</Text>
            <Flex w={'full'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>3.2k followers</Text>
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
                    <Text fontWeight={'bold'}>Replies</Text>
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

export default UserHeader;

// import { Avatar, Button, Card, Col, Divider, Row, Tabs, Typography, Space } from 'antd';
// import { EditOutlined, HeartOutlined, MessageOutlined, RetweetOutlined, InstagramOutlined } from '@ant-design/icons';
// import './UserHeader.scss';

// const { Title, Text } = Typography;
// const { TabPane } = Tabs;

// const UserHeader = () => {
//     return (
//         <div className="container">
//             <Card className="container-card">
//                 <Row className="card-row" align="middle" justify="space-between">
//                     <Col className="card-col-left">
//                         <Space className="col-space" direction="vertical">
//                             <Title
//                                 className="space-title"
//                                 level={4}
//                                 style={{ color: 'white', fontSize: '24px', margin: '0' }}
//                             >
//                                 Tâm Nguyễn
//                             </Title>
//                             <Text className="space-text" style={{ color: 'gray.light' }}>
//                                 tamng.05
//                             </Text>
//                             <Text className="space-text" style={{ color: '#b3b3b3' }}>
//                                 14 người theo dõi
//                             </Text>
//                         </Space>
//                     </Col>
//                     <Col className="card-col-right" flex="auto">
//                         <Space className="col-space" direction="vertical">
//                             <Avatar
//                                 className="space-avatar"
//                                 size={80}
//                                 src="https://instagram.fsgn5-5.fna.fbcdn.net/v/t51.2885-19/412762265_737140611666084_7755579899464631873_n.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fsgn5-5.fna.fbcdn.net&_nc_cat=100&_nc_ohc=209C8uB0G3cQ7kNvgFosnhD&_nc_gid=9ee6f57db61940fa9ca889815d15f680&edm=APs17CUBAAAA&ccb=7-5&oh=00_AYDZkqh9oYTvxFrUQQ_H3RGat63Z82pj6932ih1bVHPUCA&oe=66D36632&_nc_sid=10d13b"
//                             />
//                             <Button className="space-button" type="text" icon={<InstagramOutlined />}></Button>
//                         </Space>
//                     </Col>
//                 </Row>
//                 <Button
//                     icon={<EditOutlined />}
//                     style={{ marginTop: 10, backgroundColor: 'white', color: 'black', width: '100%' }}
//                 >
//                     Chỉnh sửa trang cá nhân
//                 </Button>
//             </Card>

//             {/* Tabs */}
//             <Tabs defaultActiveKey="1" style={{ marginTop: '20px' }}>
//                 <TabPane tab="Thread" key="1">
//                     {/* Thread Content */}
//                     <Card style={{ backgroundColor: '#242424', color: 'white' }}>
//                         <Row gutter={16}>
//                             <Col>
//                                 <Avatar src="https://via.placeholder.com/40" />
//                             </Col>
//                             <Col flex="auto">
//                                 <Space direction="vertical" size="small" style={{ width: '100%' }}>
//                                     <Text strong style={{ color: 'white' }}>
//                                         tamng.05
//                                     </Text>
//                                     <Text type="secondary" style={{ color: '#b3b3b3' }}>
//                                         09/06/2024
//                                     </Text>
//                                     <Text style={{ color: 'white' }}>
//                                         bài mới của sếp hay điên ý, phải replay chục lần rồi
//                                     </Text>
//                                 </Space>
//                                 <Divider />
//                                 <Space size="middle">
//                                     <Button type="text" icon={<HeartOutlined />} style={{ color: '#b3b3b3' }}>
//                                         1
//                                     </Button>
//                                     <Button type="text" icon={<MessageOutlined />} style={{ color: '#b3b3b3' }} />
//                                     <Button type="text" icon={<RetweetOutlined />} style={{ color: '#b3b3b3' }} />
//                                 </Space>
//                             </Col>
//                         </Row>
//                     </Card>
//                 </TabPane>
//                 <TabPane tab="Thread trả lời" key="2"></TabPane>
//                 <TabPane tab="Bài đăng lại" key="3"></TabPane>
//             </Tabs>

//             {/* Completion Section */}
//             <Card style={{ backgroundColor: '#242424', marginTop: '20px', color: 'white' }}>
//                 <Title level={5} style={{ color: 'white' }}>
//                     Hoàn tất trang cá nhân
//                 </Title>
//                 <Row gutter={16}>
//                     <Col span={8}>
//                         <Card style={{ backgroundColor: '#333333', textAlign: 'center', color: 'white' }}>
//                             <EditOutlined style={{ fontSize: '24px', marginBottom: '10px' }} />
//                             <Text>Thêm tiểu sử</Text>
//                         </Card>
//                     </Col>
//                     <Col span={8}>
//                         <Card style={{ backgroundColor: '#333333', textAlign: 'center', color: 'white' }}>
//                             <Avatar size={24} src="https://via.placeholder.com/24" style={{ marginBottom: '10px' }} />
//                             <Text>Thêm ảnh đại diện</Text>
//                         </Card>
//                     </Col>
//                     <Col span={8}>
//                         <Card style={{ backgroundColor: '#333333', textAlign: 'center', color: 'white' }}>
//                             <Text>✓</Text>
//                             <Text>Theo dõi 5 trar nhân</Text>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Card>
//         </div>
//     );
// };

// export default UserHeader;
