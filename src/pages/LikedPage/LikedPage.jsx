import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import LikedPostComponent from '../../components/LikedPostComponent/LikedPostComponent';
import { useRecoilState } from 'recoil';
import postAtom from '../../atoms/postAtom';

const LikedPage = () => {
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLikedPosts = async () => {
            setLoading(true);
            setPosts([]);
            try {
                const userLogin = JSON.parse(localStorage.getItem('userLogin'));
                const accessToken = userLogin?.accessToken;
                const res = await fetch(`/api/user/liked`, {
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
                setPosts(data.likedPosts);
            } catch (error) {
                showToast('Error', error, 'error');
            } finally {
                setLoading(false);
            }
        };
        getLikedPosts();
    }, [showToast, setPosts]);
    console.log('postLiked: ', posts);
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
            {!loading && posts.likedPosts?.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Theo dõi thêm người dùng để xem bài viết của họ</h1>
            )}
            {loading && (
                <Flex justify={'center'}>
                    <Spinner size="xl" />
                </Flex>
            )}
            {posts?.map((likedPost, index) => (
                <LikedPostComponent
                    key={likedPost._id}
                    likedPost={likedPost}
                    isLastPost={index === posts.length - 1}
                    postedBy={likedPost.postedBy}
                />
            ))}
        </Box>
    );
};

export default LikedPage;
