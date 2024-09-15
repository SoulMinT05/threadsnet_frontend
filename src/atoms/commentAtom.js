import { atom } from 'recoil';

const commentAtom = atom({
    key: 'commentAtom',
    default: [],
});

export default commentAtom;
