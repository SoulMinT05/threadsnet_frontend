import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader/UserHeader';
import UserPost from '../components/UserPost/UserPost';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Spinner, Flex } from '@chakra-ui/react';

const UserPage = () => {
    const [user, setUser] = useState(null);
    const { username } = useParams();
    const showToast = useShowToast();
    const [loading, setLoading] = useState(true);

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
        getUser();
    }, [username, showToast]);

    if (!user && loading) {
        return (
            <Flex justifyContent={'center'} alignItems={'center'}>
                <Spinner size="xl" />;
            </Flex>
        );
    }
    if (!user && !loading) return <h1 style={{ textAlign: 'center' }}>User not found</h1>;

    return (
        <div>
            <UserHeader user={user} />
            <UserPost likes={101} replies={200} postImg="/post1.png" postTitle="Let's talke about threads" />
            <UserPost likes={202} replies={301} postImg="/post2.png" postTitle="Nice tutorial" />
            <UserPost likes={303} replies={572} postImg="/post3.png" postTitle="Beautiful moment" />
            <UserPost likes={405} replies={921} postTitle="Talent girl in this performance" />
        </div>
    );
};

export default UserPage;
