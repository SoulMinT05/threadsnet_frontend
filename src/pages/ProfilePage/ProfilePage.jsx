import { useEffect, useState } from 'react';
import ProfileInfoComponent from '../../components/ProfileInfoComponent/ProfileInfoComponent';
import { useParams } from 'react-router-dom';
import useShowToast from '../../hooks/useShowToast';
import { Spinner, Flex, Divider, Avatar, Button, Box } from '@chakra-ui/react';
import HomePostComponent from '../../components/HomePostComponent/HomePostComponent';
import useGetUserProfile from '../../hooks/useGetUserProfile';
import { useRecoilState } from 'recoil';
import postAtom from '../../atoms/postAtom';
import CreatePostProfileComponent from '../../components/CreatePostProfileComponent/CreatePostProfileComponent';

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
                const userLogin = JSON.parse(localStorage.getItem('userLogin'));
                const accessToken = userLogin?.accessToken;
                const res = await fetch(`/api/post/user/${username}`, {
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
        <Box width="640px" borderRadius="lg" borderWidth="1px" boxShadow="md" p={4} m={4} mx="auto" marginRight={'0'}>
            <ProfileInfoComponent user={user} />

            {/* {!fetchingPosts && posts.length === 0 && (
                <h1 style={{ textAlign: 'center' }}>Người dùng chưa đăng bài viết nào</h1>
            )} */}
            {fetchingPosts && (
                <Flex justifyContent={'center'} my={12}>
                    <Spinner size={'xl'} />
                </Flex>
            )}
            <Flex align="center" paddingTop={'16px'}>
                <Avatar src={user?.avatar} mr={4} />
                <Flex flex="1" fontSize={'md'}>
                    <CreatePostProfileComponent />
                </Flex>
                <Button>Post</Button>
            </Flex>
            <Divider orientation="horizontal" mt={'20px'} mb={'8px'} />

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

export default ProfilePage;
