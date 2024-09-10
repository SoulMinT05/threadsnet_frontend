import { atom } from 'recoil';

const followingPostAtom = atom({
    key: 'followingPostAtom',
    default: [],
});

export default followingPostAtom;
