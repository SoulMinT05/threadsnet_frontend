import { Button } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../../atoms/userAtom';
import useShowToast from '../../hooks/useShowToast';
import { FiLogOut } from 'react-icons/fi';

const LogoutComponent = () => {
    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();

    const handleLogout = async () => {
        const res = await fetch('/api/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        console.log('data: ', data);

        if (!data.success) {
            showToast('Error', 'Logout failed', 'error');
            return;
        }
        localStorage.removeItem('userLogin');
        setUser(null);
        showToast('Success', data.message, 'success');
    };
    return (
        <>
            <Button
                position={'fixed'}
                top={'30px'}
                right={'30px'}
                size={'sm'}
                marginTop={'-18px'}
                onClick={handleLogout}
            >
                {/* <FiLogOut size={20} /> */}
                Logout
            </Button>
        </>
    );
};

export default LogoutComponent;
