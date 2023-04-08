const { Client } = require("@busshi/linkedin-private-api");

const username = "";
const password = "";

(async () => {
  // Login

  const client = new Client();
  await client.login.userPass({ username, password });

  // in an infinite loop, get all invitations and accept them.
  let first = true;
  while (true) {
    if (first) {
      console.log("Waiting for invitations...");
      first = false;
    }
    try {
      const invitesScroller = client.invitation.getReceivedInvitations();
      const invitations = await invitesScroller.scrollNext();
      if (invitations.length > 0) {
        console.log(`${invitations.length} invitation(s) found`);
        for (const invitation of invitations) {
          const { entityUrn, profile, sharedSecret } = invitation;
          const { profileId } = profile;
          const invitationId = entityUrn.split(":")[3];
          console.log(
            `Accepting invitation from ${profile.firstName} ${profile.lastName}`
          );
          await client.invitation.replyInvitation({
            invitationId,
            invitationSharedSecret: sharedSecret,
          });
          console.log(
            `Invitation from ${profile.firstName} ${profile.lastName} accepted`
          );
        }
      }
    } catch (err) {
      console.log(err);
      break;
    }
  }
})();
