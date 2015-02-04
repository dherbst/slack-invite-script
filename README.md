# slack-invite-script
Google Apps Script invite script for sheets


# Installation

1. Create a Google Form with one question, what is your email address?  Have the form send the data
to a sheet.  Make sure the sheet has the email address in column B.

2. In the sheet, click "Tools" and then "Script editor".

3. Paste the code.js over any code that is populated in the script editor and save it.  Be sure
   to get your slack api token and paste it in where specified in the invite function.

   You can get your slack api token for the team you are working with on the https://api.slack.com/web
   page under the "Authentication" section.

4. In the script editor, click "Resources" and select "Current Project's Triggers"

5. Create a trigger that:
   run: readRows
   events: from spreadsheet  "on form submit"
   and click "save"


# debugging

After pasting the code, you can run the code and then view the console to see the Logging calls.
