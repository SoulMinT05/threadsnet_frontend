import { useToast } from '@chakra-ui/react';

const useShowToast = () => {
    const toast = useToast();
    const showToast = (title, description, status) => {
        toast({
            title,
            description,
            status,
            duration: 1500,
            isClosable: true,
            position: 'top-right',
        });
    };
    return showToast;
};

export default useShowToast;
