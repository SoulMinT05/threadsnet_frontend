import { useEffect, useState } from 'react';
import ProfileInfoComponent from '../components/ProfileInfoComponent/ProfileInfoComponent';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Spinner, Flex } from '@chakra-ui/react';
import HomePostComponent from '../components/HomePostComponent/HomePostComponent';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useRecoilState } from 'recoil';
import postAtom from '../atoms/postAtom';

const ProfilePage = () => {
    const { loading, user } = useGetUserProfile();
    const { username } = useParams();
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postAtom);
    const [fetchingPosts, setFetchingPosts] = useState(true);

    useEffect(() => {
        const getPosts = async () => {
            setFetchingPosts(true);
            try {
                const res = await fetch(`/api/post/user/${username}`);
                const data = await res.json();
                if (!data.success) {
                    showToast('Error', data.message, 'error');
                    return;
                }
                setPosts(data.posts);
            } catch (error) {
                showToast('Error', error, 'error');
                setPosts([]);
            } finally {
                setFetchingPosts(false);
            }
        };
        getPosts();
    }, [username, showToast, setPosts, user]);
    if (!user && loading) {
        return (
            <Flex justifyContent={'center'} alignItems={'center'}>
                <Spinner size="xl" />;
            </Flex>
        );
    }
    if (!user && !loading) return <h1 style={{ textAlign: 'center' }}>User not found</h1>;

    return (
        <>
            <ProfileInfoComponent user={user} />

            {!fetchingPosts && posts.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Người dùng chưa đăng bài viết nào</h1>
            )}
            {fetchingPosts && (
                <Flex justifyContent={'center'} my={12}>
                    <Spinner size={'xl'} />
                </Flex>
            )}
            {posts?.map((post) => (
                <HomePostComponent key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    );
};

export default ProfilePage;
