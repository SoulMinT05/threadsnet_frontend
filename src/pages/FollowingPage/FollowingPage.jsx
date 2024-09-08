import { Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import FollowingPostComponent from '../../components/FollowingPostComponent/FollowingPostComponent';

const HomePage = () => {
    const showToast = useShowToast();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFollowingPosts = async () => {
            setLoading(true);
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
                setPosts(data);
            } catch (error) {
                showToast('Error', error, 'error');
            } finally {
                setLoading(false);
            }
        };
        getFollowingPosts();
    }, [showToast]);
    console.log('postsss: ', posts);
    return (
        <>
            {!loading && posts.followingPosts?.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Theo dõi thêm người dùng để xem bài viết của họ</h1>
            )}
            {loading && (
                <Flex justify={'center'}>
                    <Spinner size="xl" />
                </Flex>
            )}
            {posts?.followingPosts?.map((followingPost) => (
                <FollowingPostComponent
                    key={followingPost._id}
                    followingPost={followingPost}
                    postedBy={followingPost.postedBy}
                />
            ))}
        </>
    );
};

export default HomePage;
