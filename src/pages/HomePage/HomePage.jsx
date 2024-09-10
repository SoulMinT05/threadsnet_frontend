import { Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import HomePostComponent from '../../components/HomePostComponent/HomePostComponent';
import { useRecoilState } from 'recoil';
import postAtom from '../../atoms/postAtom';

const HomePage = () => {
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postAtom);
    const [loading, setLoading] = useState(true);
    console.log('postsHome: ', posts);

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
                console.log('dataHome: ', data);
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
        <>
            {!loading && posts.post?.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Bạn đã lướt hết bài viết rồi</h1>
            )}
            {loading && (
                <Flex justify={'center'}>
                    <Spinner size="xl" />
                </Flex>
            )}
            {posts?.map((post) => (
                <HomePostComponent key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    );
};

export default HomePage;
