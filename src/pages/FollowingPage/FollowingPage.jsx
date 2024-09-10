import { Flex, Spinner } from '@chakra-ui/react';
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
        <>
            {!loading && posts.followingPosts?.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Theo dõi thêm người dùng để xem bài viết của họ</h1>
            )}
            {loading && (
                <Flex justify={'center'}>
                    <Spinner size="xl" />
                </Flex>
            )}
            {posts?.map((followingPost) => (
                <FollowingPostComponent
                    key={followingPost._id}
                    followingPost={followingPost}
                    postedBy={followingPost.postedBy}
                />
            ))}
        </>
    );
};

export default FollowingPage;
