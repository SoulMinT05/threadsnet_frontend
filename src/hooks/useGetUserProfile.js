import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';

const useGetUserProfile = () => {
    const [user, setUser] = useState(null);
    const { username } = useParams();
    const showToast = useShowToast();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getUser = async () => {
            try {
                const userLogin = JSON.parse(localStorage.getItem('userLogin'));
                const accessToken = userLogin?.accessToken;

                const res = await fetch(`/api/user/profile/${username}`, {
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
                setUser(data.user);
            } catch (error) {
                showToast('Error', error, 'error');
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, [username, showToast]);
    return { loading, user };
};

export default useGetUserProfile;
