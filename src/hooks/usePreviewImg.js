import { useState } from 'react';
import useShowToast from './useShowToast';

const usePreviewImg = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const showToast = useShowToast();

    const handleImgChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader(); // init new

            reader.onloadend = () => {
                setImgUrl(reader.result); //result after file is read
            };
            reader.readAsDataURL(file); //convert file to file base64
        } else {
            showToast('Invalid type file', 'Must select an image file!', 'error');
            setImgUrl(null);
        }
    };
    return { handleImgChange, imgUrl };
};

export default usePreviewImg;
