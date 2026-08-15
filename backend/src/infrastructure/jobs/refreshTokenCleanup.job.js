import cron from "node-cron";

import RefreshToken from "../../modules/auth/models/RefreshToken.js";

const refreshTokenCleanup = () => {

    cron.schedule(

        "0 0 * * *",

        async () => {

            try {

                const result = await RefreshToken.deleteMany({

                    expiresAt: {

                        $lt: new Date()

                    }

                });

                console.log(

                    `Deleted ${result.deletedCount} expired refresh tokens`

                );

            } catch (error) {

                console.log(error);

            }

        }

    );

};

export default refreshTokenCleanup;