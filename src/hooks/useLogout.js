import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const logout = async () => {
        const res = await fetch('/api/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();

        if (!data.success) {
            showToast('Error', 'Logout failed', 'error');
            return;
        }
        localStorage.removeItem('userLogin');
        setUser(null);
        showToast('Success', data.message, 'success');
        navigate('/login');
    };
    return logout;
};

export default useLogout;
