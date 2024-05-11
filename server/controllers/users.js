import User from "../models/User.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

export const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select("-password -updatedAt");
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const searchUser = async (req, res) => {
    const {searchText} = req.query;
    
    if(!searchText){
        return res.status(404).json({error: "No input provided"})  
    }

    try {
        let searchPostQuery = {};
    
        if (searchText) {
          searchPostQuery = {
            $or: [
              { email: { $regex: searchText, $options: "i" } },
              { firstName: { $regex: searchText, $options: "i" } },
              { lastName: { $regex: searchText, $options: "i" } },
            ],
          };
        }
    
        const user = await User.findOne(searchPostQuery).select("-password -updatedAt");

        if(!user){
            return res.status(404).json({error: "User not found"})     
        }

        res.status(200).json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
}



export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id)
        
        const friends = await Promise.all(
            user.friends.map(id => User.findById(id))
        );
        
        const formattedFriends = friends.map(({_id, firstName, lastName, occupation, location, picturePath}) => {
            return {_id, firstName, lastName, occupation, location, picturePath}
        })
    
        res.status(200).json(formattedFriends)  
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const getFriendSuggestions = async (req, res) => {
    try {
        // Get the ID of the current logged-in user
        const loggedInUserId = req.params.id;

        // Find the logged-in user's details
        const loggedInUser = await User.findById(loggedInUserId);

        const friendSuggestions = await User.find({
           $and: [
            {_id : {$ne : loggedInUserId}},
            {_id : {$nin : loggedInUser.friends}}, 
           ]
        });


        res.status(200).json(friendSuggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        let msg;
        if (user.friends.includes(friendId)) {
            // Remove from friend list
            user.friends = user.friends.filter(userId => userId !== friendId);
            friend.friends = friend.friends.filter(userId => userId !== id);
            msg = "removed";
        } else {
            // Add to friend list
            user.friends.push(friendId);
            friend.friends.push(id);
            msg = "added";
        }

        // Save changes
        await user.save();
        await friend.save();
        
        const friends = await Promise.all(
            user.friends.map(id => User.findById(id))
        );

        const formattedFriends = friends.map(({_id, firstName, lastName, occupation, location, picturePath}) => {
            return {_id, firstName, lastName, occupation, location, picturePath}
        })

        res.status(200).json({ formattedFriends, msg });

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const updateSocial = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you're passing the user's ID in the request parameters
        const { socialPlatform, profileUrl } = req.body; // Assuming you're sending the social platform and updated URL in the request body
        
        // Validate if userId is provided
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Validate if socialPlatform and profileUrl are provided
        if (!socialPlatform || !profileUrl) {
            return res.status(400).json({ error: 'Social platform and profile URL are required' });
        }

        // Find the user by ID
        const user = await User.findById(id);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the social profile URL based on the social platform
        if (user.socialProfileUrl.hasOwnProperty(socialPlatform)) {
            user.socialProfileUrl[socialPlatform] = profileUrl;
        } else {
            return res.status(400).json({ error: 'Invalid social platform' });
        }

        // Save the updated user data
        await user.save();

        // Return success response
        return res.status(200).json({socialProfileUrl: user.socialProfileUrl} );
    } catch (err) {
        console.error('Error updating social profile URL:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


export const updateProfile = async (req, res) => {
  try {
    
    const {id} = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: 'Invalid user or user cannot be found' });
    }

    // Extract fields from request body
    const { firstName, lastName, location, occupation } = req.body;
    const pictureObj = req.file;
    let picture;

    if(pictureObj){
        picture = await uploadOnCloudinary(pictureObj.path)
    }

    // Define fields to update
    const fieldsToUpdate = { 
        firstName, 
        lastName, 
        location, 
        occupation, 
        picturePath: picture?.url || '' 
    };

    // Update user profile fields if provided
    Object.keys(fieldsToUpdate).forEach(field => {
      if (fieldsToUpdate[field] !== undefined && fieldsToUpdate[field] !== '') {
        user[field] = fieldsToUpdate[field];
      }
    });

    // Save the updated user
    await user.save();

    // Respond with success message
    res.status(200).json({user, msg: "Profile has been updated successfully"});
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
