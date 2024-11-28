import { createContext, useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import io from 'socket.io-client';
import userAtom from '../atoms/userAtom';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        const socket = io('http://localhost:3001', {
            query: {
                userId: user?.userData?._id,
            },
        });

        setSocket(socket);

        socket.on('getOnlineUsers', (users) => {
            setOnlineUsers(users);
        });
        return () => socket && socket.close();
    }, [user?.userData?._id]);

    console.log('onlineUsers: ', onlineUsers);

    return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
