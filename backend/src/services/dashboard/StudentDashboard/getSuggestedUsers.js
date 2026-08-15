import User from "../../../models/user/User.js";

const getSuggestedUsers = async (userId) => {

    const users = await User.find({

        role: "student",

        profileCompleted: true,

        _id: { $ne: userId }

    })

        .select(

            "firstName lastName avatar bio skills"

        )

        .sort({

            createdAt: -1

        })

        .limit(4);

    return users.map(user => ({

        _id: user._id,

        fullName:

            `${user.firstName} ${user.lastName}`,

        avatar: user.avatar,

        bio: user.bio,

        skills: user.skills

    }));

};

export default getSuggestedUsers;