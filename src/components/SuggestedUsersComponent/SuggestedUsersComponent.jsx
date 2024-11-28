import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SuggestedUserComponent from '../SuggestedUserComponent/SuggestedUserComponent';
import useShowToast from '../../hooks/useShowToast';

const SuggestedUsersComponent = () => {
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const showToast = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true);
            try {
                const userLogin = JSON.parse(localStorage.getItem('userLogin'));
                const accessToken = userLogin?.accessToken;
                const res = await fetch('/api/user/getSuggestedUsers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await res.json();
                console.log('dataSuggest: ', data);
                if (data.error) {
                    showToast('Error', data.error, 'error');
                    return;
                }
                setSuggestedUsers(data);
            } catch (error) {
                showToast('Error', error.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        getSuggestedUsers();
    }, [showToast]);

    return (
        <>
            <Text mb={4} fontWeight={'bold'}>
                Suggested Users
            </Text>
            <Flex direction={'column'} gap={4}>
                {!loading && suggestedUsers.map((user) => <SuggestedUserComponent key={user._id} user={user} />)}
                {loading &&
                    [0, 1, 2, 3, 4].map((_, idx) => (
                        <Flex key={idx} gap={2} alignItems={'center'} p={'1'} borderRadius={'md'}>
                            {/* avatar skeleton */}
                            <Box>
                                <SkeletonCircle size={'10'} />
                            </Box>
                            {/* username and fullname skeleton */}
                            <Flex w={'full'} flexDirection={'column'} gap={2}>
                                <Skeleton h={'8px'} w={'80px'} />
                                <Skeleton h={'8px'} w={'90px'} />
                            </Flex>
                            {/* follow button skeleton */}
                            <Flex>
                                <Skeleton h={'20px'} w={'60px'} />
                            </Flex>
                        </Flex>
                    ))}
            </Flex>
        </>
    );
};

export default SuggestedUsersComponent;

// Loading skeletons for suggested users, if u want to copy and paste as shown in the tutorial

// <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
// 							{/* avatar skeleton */}
// 							<Box>
// 								<SkeletonCircle size={"10"} />
// 							</Box>
// 							{/* username and fullname skeleton */}
// 							<Flex w={"full"} flexDirection={"column"} gap={2}>
// 								<Skeleton h={"8px"} w={"80px"} />
// 								<Skeleton h={"8px"} w={"90px"} />
// 							</Flex>
// 							{/* follow button skeleton */}
// 							<Flex>
// 								<Skeleton h={"20px"} w={"60px"} />
// 							</Flex>
// 						</Flex>
