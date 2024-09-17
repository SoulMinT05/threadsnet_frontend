import { Avatar, Box, Button, List, ListItem, Text, Flex } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import { useState } from 'react';
import useShowToast from '../../hooks/useShowToast';

const BlockedListPage = () => {
    const userByAtom = useRecoilValue(userAtom);
    const user = userByAtom?.userData;
    const [currentUser, setCurrentUser] = useRecoilState(userAtom);

    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();

    const handleUnblock = async (e) => {
        // setLoading(true);
        const userId = e.target.getAttribute('data-reply-id');
        try {
            // if (!window.confirm('Are you sure you want to delete this post?')) return;
            const userLogin = JSON.parse(localStorage.getItem('userLogin'));
            const accessToken = userLogin?.accessToken;
            const res = await fetch(`/api/user/unblocked/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            console.log('dataUnblocked: ', data);
            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            }
            showToast('Success', 'Unblocked user successfully', 'success');

            const updatedUserLogin = {
                ...userLogin,
                userData: data.response,
                success: data.success,
                message: data.message,
                accessToken: userLogin.accessToken,
            };
            localStorage.setItem('userLogin', JSON.stringify(updatedUserLogin));

            setCurrentUser(updatedUserLogin);

            console.log('updatedUserLogin: ', updatedUserLogin);
        } catch (error) {
            showToast('Error', error, 'error');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <Box
                w="100%"
                maxW="600px"
                mx="auto"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                mt="4"
                p="4"
            >
                <List spacing={3}>
                    {user?.blockedList.length > 0 ? (
                        user?.blockedList.map((u) => (
                            <ListItem key={u._id} p="3" borderColor="gray.200">
                                <Flex align="center" justify="space-between">
                                    <Flex align="center">
                                        <Avatar name={u.username} src={u.avatar} />
                                        <Box ml="3">
                                            <Text fontWeight="bold">{u.username}</Text>
                                            <Text fontSize="sm">{u.email}</Text>
                                        </Box>
                                    </Flex>
                                    <Button
                                        // isLoading={loading === u._id}
                                        data-reply-id={u._id}
                                        colorScheme="green"
                                        size="sm"
                                        onClick={handleUnblock}
                                    >
                                        Unblock
                                    </Button>
                                </Flex>
                            </ListItem>
                        ))
                    ) : (
                        <Text>No blocked users found.</Text>
                    )}
                </List>
            </Box>
        </div>
    );
};

export default BlockedListPage;
