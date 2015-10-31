# slack-invite-script
Google Apps Script invite script for sheets

# Installation

1. Create a Google Form with one question, what is your email address?  Have the
form send the data to a sheet.  Make sure the sheet has the email address in
column B.

2. In the sheet, click "Tools" and then "Script editor".

3. Paste the code.js over any code that is populated in the script editor and
save it.

4. Fill in the following information:

   * in `getMyHost()` fill in your slack domain
   * in `getToken()` fill in your slack api token. You can get your slack api token for the team you are working with on the https://api.slack.com/web page under the "Authentication" section.
   * in `getSignupChannel()` fill in the channel you want to send updates to.   You may have to put the channel id depending on where you are sending the update.  See https://api.slack.com/methods/chat.postMessage for more details.

5. In the script editor, click "Resources" and select "Current Project's
Triggers"

6. Create a trigger that:
  run: readRows
  events: from spreadsheet  "on form submit"
  and click "save"


# debugging

After pasting the code, you can run the code and then view the console to see
the Logging calls.
