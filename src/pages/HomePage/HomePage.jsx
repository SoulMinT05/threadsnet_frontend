import { Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import HomePostComponent from '../../components/HomePostComponent/HomePostComponent';

const HomePage = () => {
    const showToast = useShowToast();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/post/getAllPosts`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
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
        getFeedPosts();
    }, [showToast]);
    console.log('feedPostsAfter: ', posts);
    return (
        <>
            {!loading && posts.post?.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Bạn đã lướt hết bài viết rồi</h1>
            )}
            {loading && (
                <Flex justify={'center'}>
                    <Spinner size="xl" />
                </Flex>
            )}
            {posts?.posts?.map((post) => (
                <HomePostComponent key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    );
};

export default HomePage;
