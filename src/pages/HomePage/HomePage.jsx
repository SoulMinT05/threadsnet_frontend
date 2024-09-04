import { Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import FollowingPostPage from '../FollowingPostPage/FollowingPostPage';

const HomePage = () => {
    const showToast = useShowToast();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFeedPosts = async () => {
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
                console.log('data22: ', data);
                console.log('11');
                setPosts(data);
            } catch (error) {
                showToast('Error', error, 'error');
            } finally {
                setLoading(false);
            }
        };
        getFeedPosts();
    }, [showToast]);
    console.log('postsss: ', posts);
    return (
        <>
            {!loading && posts.followingPosts.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Follow more users to see them posts</h1>
            )}
            {loading && (
                <Flex justify={'center'}>
                    <Spinner size="xl" />
                </Flex>
            )}
            {posts?.followingPosts?.map((followingPost) => (
                <FollowingPostPage
                    key={followingPost._id}
                    followingPost={followingPost}
                    postedBy={followingPost.postedBy}
                />
            ))}
        </>
    );
};

export default HomePage;
