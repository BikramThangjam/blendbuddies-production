import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {setPosts} from "../../reducers";
import PostWidget from "./PostWidget";
import { API_URL } from "../../config";
import { Box, Typography } from "@mui/material";


const PostsWidget = ({userId, isProfile = false}) => {
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts);
    const token = useSelector(state => state.token);
    const loggedInUserId = useSelector(state => state.user._id);
   

    const getPosts = async () => {

        const response = await fetch(`${API_URL}/posts`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`},
        })

        const data = await response.json();
        dispatch(setPosts({posts: data}));
        
    }

    const getUserPosts = async () => {
        const response = await fetch(`${API_URL}/posts/${userId}/posts`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`},
        })

        const data = await response.json();
        
        dispatch(setPosts({posts: data}));
        
    }

    useEffect(()=>{
        if(isProfile){
            getUserPosts();
        }else{           
            getPosts();
        }
    }, [isProfile]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {
                posts?.length > 0 ? (
                    posts.map(
                        ({
                            _id,
                            userId,
                            firstName,
                            lastName,
                            description,
                            location,
                            picturePath,
                            userPicturePath,
                            likes,
                            comments,
                            createdAt,
                        })=>(
                            <PostWidget 
                                key={_id}
                                postId={_id}
                                postUserId={userId}
                                name = {`${firstName} ${lastName}`}
                                description={description}
                                location={location}
                                picturePath={picturePath}
                                userPicturePath={userPicturePath}
                                likes={likes}
                                comments={comments}
                                createdAt={createdAt}
                                
                            />
                        )
                    )
                ) : (
                    <Box sx={{display: "flex", justifyContent:"center", margin: "2rem 0"}}>
                        {userId === loggedInUserId ? (
                            <Typography>You have not created any post.</Typography>
                        ): (
                            <Typography>There is no post to show.</Typography>
                        )}
                                        
                    </Box>
                )
            }
        </>
    )

};

export default PostsWidget;