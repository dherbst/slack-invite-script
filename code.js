/**
 * Retrieves all the rows in the active spreadsheet that contain data
 * When going through the rows if there no value in "invited by" then
 * sends the email field to the slack invite service.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function readRows() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();

  // Sheet is a forms response sheet with 3 columns
  // "Timestamp" "What is your email address?" "Invited by"

  Logger.log("Looking for rows with email but no invited by...");
  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    var email = row[1];
    var invitedBy = row[2];
    if ((invitedBy === "" || invitedBy === undefined) && (email !== "" && email !== undefined)) {
      Logger.log("Inviting email=" + email);

      invite(email);
      sheet.getRange(i+1, 3).setValue("scriptbot");

      SpreadsheetApp.flush();
    }
  }
};

/**
 * obscure the full email
 */
function hideEmail(email) {
  email = email.replace(/(.+)@.+$/, "$1@redacted");
  Logger.log("replaced email with " + email);
  return email;
};

/**
 * Tell the signupform channel you invited someone
 */
function sayInvited(email) {
  var payload = getPayload();
  if (payload === undefined || payload === null) {
    return;
  }

  var time = Math.ceil(new Date().getTime()/1000);
  var url = "https://phillydev.slack.com/api/chat.postMessage?t=" + time;

  payload["channel"] = "#signupform";
  var text = "Invited " + hideEmail(email);
  payload["text"] = text;
  payload["username"] = "dherbstscriptbot";


  var options =
      {
        "method"  : "POST",
        "payload" : payload,
        "followRedirects" : true,
        "muteHttpExceptions": true
      };

  var result = UrlFetchApp.fetch(url, options);

  if (result.getResponseCode() == 200) {

    var params = JSON.parse(result.getContentText());

    Logger.log(params);
  } else {
    Logger.log("exception");
    Logger.log(result);
  }

};

/**
 * Return a payload object with the basic required information.
 */
function getPayload() {
  var token = "fill_in_your_api_token"
  if (token == "fill_in_your_api_token") {
    Logger.log("You have to fill in your api token");
    return;
  }

  var payload =
      {
        "token" : token,
        "type" : "post"
      };

  return payload;
}

/**
 * Sends the email to the slack invite endpoint.  You need to fill in your api token
 * and the channels you want the user to be added to.
 *
*/
function invite(email) {

  var time = Math.ceil(new Date().getTime()/1000);
  var url = "https://phillydev.slack.com/api/users.admin.invite?t=" + time;
  var payload = getPayload();

  if (payload === undefined || payload === null) {
    return;
  }

  payload["email"] = email;
  payload["channels"] = "C03G04GL7,C03EC6Y8L";
  payload["set_active"] = "true";
  payload["_attempts"] = "1";


  var options =
      {
        "method"  : "POST",
        "payload" : payload,
        "followRedirects" : true,
        "muteHttpExceptions": true
      };

  var result = UrlFetchApp.fetch(url, options);

  if (result.getResponseCode() == 200) {

    var params = JSON.parse(result.getContentText());

    Logger.log(params);

    sayInvited(email);

  } else {
    Logger.log("exception");
    Logger.log(result);
  }

};

/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the readRows() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Invite to Slack",
    functionName : "readRows"
  }];
  spreadsheet.addMenu("Script Center Menu", entries);
};
