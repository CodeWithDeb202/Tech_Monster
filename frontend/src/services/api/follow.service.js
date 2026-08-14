import api from "./axios";
import { API } from "./endpoints";

export const followUser = (userId) => {
    return api.post(
        API.FOLLOW.FOLLOW_USER(userId)
    );
};

export const unfollowUser = (userId) => {
    return api.delete(
        API.FOLLOW.UNFOLLOW_USER(userId)
    );
};

export const getFollowers = (userId) => {
    return api.get(
        API.FOLLOW.FOLLOWERS(userId)
    );
};

export const getFollowing = (userId) => {
    return api.get(
        API.FOLLOW.FOLLOWING(userId)
    );
};