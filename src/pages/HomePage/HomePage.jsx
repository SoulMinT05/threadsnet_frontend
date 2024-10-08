import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import HomePostComponent from '../../components/HomePostComponent/HomePostComponent';
import { useRecoilState } from 'recoil';
import postAtom from '../../atoms/postAtom';

const HomePage = () => {
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
            setPosts([]);
            try {
                const userLogin = JSON.parse(localStorage.getItem('userLogin'));
                const accessToken = userLogin?.accessToken;
                const res = await fetch(`/api/post/getAllPosts`, {
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
                setPosts(data.posts);
            } catch (error) {
                showToast('Error', error, 'error');
            } finally {
                setLoading(false);
            }
        };
        getFeedPosts();
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
            {!loading && posts.post?.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Bạn đã lướt hết bài viết rồi</h1>
            )}
            {loading && (
                <Flex justify={'center'}>
                    <Spinner size="xl" />
                </Flex>
            )}

            {posts?.map((post, index) => (
                <HomePostComponent
                    key={post._id}
                    post={post}
                    isLastPost={index === posts.length - 1}
                    postedBy={post.postedBy}
                />
            ))}
        </Box>
    );
};

export default HomePage;
