const Clerk = require('@clerk/clerk-sdk-node/cjs/instance').default;
const dotenv = require("dotenv");
dotenv.config();

const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY  });


async function test(){
  await clerkClient.users.updateUserMetadata('user_2Z0VHSfJODfc4FLdqL8vQiGSeyr', {
    privateMetadata: {
        stripeId: "stripeId"
    }
  })
}

test()