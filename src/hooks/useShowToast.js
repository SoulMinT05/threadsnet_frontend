import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

const useShowToast = () => {
    const toast = useToast();
    const showToast = useCallback(
        (title, description, status) => {
            toast({
                title,
                description,
                status,
                duration: 1500,
                isClosable: true,
                position: 'top-right',
            });
        },
        [toast],
    );
    // useCallback:  it's memorized the memory, only re-render if toast changed
    return showToast;
};

export default useShowToast;
