# slack-invite-script
Google Apps Script invite script for sheets


# Installation

1. Create a Google Form with one question, what is your email address?  Have the form send the data
to a sheet.  Make sure the sheet has the email address in column B.

2. In the sheet, click "Tools" and then "Script editor".

3. Paste the code.js over any code that is populated in the script editor and save it.

4. In the script editor, click "Resources" and select "Current Project's Triggers"

5. Create a trigger that:
   run: readRows
   events: from spreadsheet  "on form submit"
   and click "save"


# debugging

After pasting the code, you can run the code and then view the console to see the Logging calls.
