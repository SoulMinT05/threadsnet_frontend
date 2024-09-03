import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader/UserHeader';
import UserPost from '../components/UserPost/UserPost';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

const UserPage = () => {
    const [user, setUser] = useState(null);
    console.log('user: ', user);
    const { username } = useParams();
    const showToast = useShowToast();

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
            }
        };
        getUser();
    }, [username, showToast]);

    if (!user) return null;

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
