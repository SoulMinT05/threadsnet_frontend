import { atom } from 'recoil';

// Store user info login
const userAtom = atom({
    key: 'userAtom',
    default: JSON.parse(localStorage.getItem('userLogin')),
});

export default userAtom;
