import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader/UserHeader';
import UserPost from '../components/UserPost/UserPost';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Spinner, Flex } from '@chakra-ui/react';
import HomePostComponent from '../components/HomePostComponent/HomePostComponent';

const UserPage = () => {
    const [user, setUser] = useState(null);

    const { username } = useParams();
    const showToast = useShowToast();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [fetchingPosts, setFetchingPosts] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/profile/${username}`);
                const data = await res.json();
                console.log('data: ', data);
                if (!data.success) {
                    showToast('Error', data.message, 'error');
                    return;
                }
                setUser(data.user);
            } catch (error) {
                showToast('Error', error, 'error');
            } finally {
                setLoading(false);
            }
        };
        const getPosts = async () => {
            setFetchingPosts(true);
            try {
                const res = await fetch(`/api/post/user/${username}`);
                const data = await res.json();
                console.log('data: ', data);
                if (!data.success) {
                    showToast('Error', data.message, 'error');
                    return;
                }
                setPosts(data);
            } catch (error) {
                showToast('Error', error, 'error');
                setPosts([]);
            } finally {
                setFetchingPosts(false);
            }
        };
        getUser();
        getPosts();
    }, [username, showToast]);

    if (!user && loading) {
        return (
            <Flex justifyContent={'center'} alignItems={'center'}>
                <Spinner size="xl" />;
            </Flex>
        );
    }
    if (!user && !loading) return <h1 style={{ textAlign: 'center' }}>User not found</h1>;
    console.log('posts: ', posts);

    return (
        <>
            <UserHeader user={user} />

            {!fetchingPosts && posts.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Người dùng chưa đăng bài viết nào</h1>
            )}
            {fetchingPosts && (
                <Flex justifyContent={'center'} my={12}>
                    <Spinner size={'xl'} />
                </Flex>
            )}
            {posts?.posts?.map((post) => (
                <HomePostComponent key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    );
};

export default UserPage;
