const Clerk = require("@clerk/clerk-sdk-node");
const dotenv = require("dotenv");
dotenv.config();

// Den her er er doomed og er "legacy" fra tidligere struktur. SKal måske bruges så efterlader bare men crasher serveren hvis den kaldes så skal IKKE efterlades i prod

const clerkClient = Clerk.Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

async function updateUserSteps(req, res, models) {
  try {
    let step = 0;
    const { userId } = req.body;

    if (req.body.title) {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          title: req.body.title,
        },
      });
      step = 1;
    }

    if (req.body.subdomain) {
      step = 2;

      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          subdomain: req.body.subdomain,
        },
      });
    }

    if (req.body.template_id) {
      
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          template_id: req.body.template_id,
        },
      });

      step = 3;
    }

    

    const user = clerkClient.users.getUser(userId);
    const userPrivate = (await user).privateMetadata;
    if (
      userPrivate.template_id &&
      userPrivate.subdomain &&
      userPrivate.title
    ) {
      // input er subdomain, title, user_id, template_id
      websiteGenerator(
        userPrivate.subdomain,
        userPrivate.title,
        userId,
        userPrivate.template_id
      );
    }


    updateClerk(step, userId);

    res.status(200).json({ step });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" + error.message });
  }
}

async function updateClerk(step, userId) {
  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      title: step,
    },
  });
}

module.exports = updateUserSteps;
