import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import FollowingPostComponent from '../../components/FollowingPostComponent/FollowingPostComponent';
import { useRecoilState } from 'recoil';
import postAtom from '../../atoms/postAtom';

const FollowingPage = () => {
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFollowingPosts = async () => {
            setLoading(true);
            setPosts([]);
            try {
                const userLogin = JSON.parse(localStorage.getItem('userLogin'));
                const accessToken = userLogin?.accessToken;
                const res = await fetch(`/api/post/following`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await res.json();
                if (!data.success) {
                    showToast('Error', data.message, 'error');
                    return;
                }
                setPosts(data.followingPosts);
            } catch (error) {
                showToast('Error', error, 'error');
            } finally {
                setLoading(false);
            }
        };
        getFollowingPosts();
    }, [showToast, setPosts]);
    return (
        <Box
            width="640px" // Đặt chiều rộng của Box
            borderRadius="lg" // Thay đổi kích thước borderRadius nếu cần
            borderWidth="1px" // Thêm border nếu cần
            boxShadow="md" // Thêm bóng cho phần tử để làm nổi bật hơn
            p={4} // Padding cho phần tử
            m={4} // Margin cho phần tử, nếu cần
            mx="auto"
            marginRight={'0'}
        >
            {!loading && posts.followingPosts?.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Theo dõi thêm người dùng để xem bài viết của họ</h1>
            )}
            {loading && (
                <Flex justify={'center'}>
                    <Spinner size="xl" />
                </Flex>
            )}
            {posts?.map((followingPost, index) => (
                <FollowingPostComponent
                    key={followingPost._id}
                    followingPost={followingPost}
                    isLastPost={index === posts.length - 1}
                    postedBy={followingPost.postedBy}
                />
            ))}
        </Box>
    );
};

export default FollowingPage;
