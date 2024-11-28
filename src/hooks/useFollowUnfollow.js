import { useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';

const useFollowUnfollow = (user) => {
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(user.followers.includes(currentUser?.userData?._id));
    const [updating, setUpdating] = useState(false);
    const showToast = useShowToast();

    const handleFollowUnfollow = async () => {
        if (!currentUser) {
            showToast('Error', 'Please login to follow', 'error');
            return;
        }
        if (updating) return;
        setUpdating(true);
        try {
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch(`/api/user/follow/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }
            setFollowing(!following);
            // 2 user unfollow
            // true: followed --> unfollow
            // false: unfollowed --> follow
            if (following) {
                showToast('Success', `Unfollow ${user.name}`, 'success');
                user.followers.pop();
            } else {
                showToast('Success', `Follow ${user.name}`, 'success');
                user.followers.push(currentUser?._id);
            }
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setUpdating(false);
        }
    };

    return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
