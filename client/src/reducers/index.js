import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: "",
    token: null,
    posts: [],
    isOpen: false,
    notification: false,
    notifMsg: "",
    friendsOfFriends:[],
    suggestedFriends: [],
    conversations: [],
    selectedConversation: ""
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },

        openModal: state => {
            state.isOpen = true;
        },

        closeModal: state => {
            state.isOpen = false;
        },
       
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },

        setLogout: (state) => initialState,

        setFriends: (state, action) => {
            if(state.user){
                state.user.friends = action.payload.friends;
            }else {
                console.error("user friends non-existent");
            }
        },

        setFriendsOfFriends: (state, action) => {
            if(state.user){
                state.user.friendsOfFriends = action.payload.friendsOfFriends;
            }else {
                console.error("user friends non-existent");
            }
        },

        setSuggestedFriends: (state, action) => {
            if(state.suggestedFriends){
                state.suggestedFriends = action.payload.suggestedFriends;
            }else {
                console.error("user friends non-existent");
            }
        },

        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },

        setPost: (state, action) => {

            const updatedPosts = state.posts.map((post) => {
                if(post._id === action.payload.post._id) return action.payload.post;
                return post;
            });

            state.posts = updatedPosts;
        },

        setUserProfile: (state, action) => {
            state.user.socialProfileUrl = action.payload.socialProfileUrl
        },

        showNotification: state => {state.notification = true},
        closeNotification: state => {state.notification = false},
        setNotifMsg: (state, action) => {
            state.notifMsg = action.payload.msg;
        },
        setConversations: (state, action) => {
            state.conversations = action.payload.conversations;
        },
         setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload.selectedConversation;
         }
    }
})

export const {
    setMode, 
    openModal, 
    closeModal, 
    setLogin, 
    setLogout, 
    setFriends,
    setFriendsOfFriends, 
    setPost, 
    setPosts, 
    setUserProfile, 
    setSuggestedFriends,
    showNotification,
    closeNotification,
    setNotifMsg,
    setConversations,
    setSelectedConversation,
} = authSlice.actions;

export default authSlice.reducer;