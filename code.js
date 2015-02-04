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
    if (row[2] == "" && row[1] != "") {
      var time = Math.ceil(new Date().getTime()/1000);
      Logger.log("Inviting email="+row[1]+ " t="+time);

      invite(row[1]);
      sheet.getRange(i+1, 3).setValue("scriptbot");

      SpreadsheetApp.flush();
    }
  }
};

/**
 * Sends the email to the slack invite endpoint.  You need to fill in your api token
 * and the channels you want the user to be added to.
 *
*/
function invite(email) {

  var time = Math.ceil(new Date().getTime()/1000);
  var url = "https://phillydev.slack.com/api/users.admin.invite?t=" + time;
  var payload =
      {
        "email" : email,
        "token" : "fill_in_your_api_token",
        "channels": "C03G04GL7,C03EC6Y8L",
        "set_active": "true",
        "_attempts": "1",
        "type" : "post",
      };

  if (payload["token"] == "fill_in_your_api_token") {
    Logger.log("You have to fill in your api token");
    return;
  }

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

function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Invite to Slack",
    functionName : "readRows"
  }];
  spreadsheet.addMenu("Script Center Menu", entries);
};
