import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { API_URL } from "../config";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketContextProvider = ({children}) => {

    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const loggedInUser = useSelector(state => state.user);

    useEffect(()=>{
        const socket = io(API_URL, {    
            query:{
                userId: loggedInUser?._id
            },
        });

        setSocket(socket);

        socket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        })

        return () => socket && socket.close()

    },[loggedInUser?._id])


    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            {children}
        </SocketContext.Provider>
    );
}