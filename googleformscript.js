// Script made by MrFrenzoid. This script is dynamic, and will work under any modification made to the actual form.
// When the form gets submitted, this event (onSubmit) gets triggered.
function onSubmit(event) {
  
  // Form Constants:
  const FORM = FormApp.getActiveForm();                            // Gets the google docs form DOM element.
  const ALLRESPONSES = FORM.getResponses();                        // Gets all the form responses.
  const LATESTRESPONSE = ALLRESPONSES.pop();                       // Gets the last form reponse submitted.
  const REPONSE = LATESTRESPONSE.getItemResponses();               // A response to one question item within the form.
  const EMBEDFIELDS = [];                                          // Embed's fields array (https://discordapp.com/developers/docs/resources/channel#embed-object-embed-field-structure).
  
  // Webhook's Constants:
  const WEBHOOKPOSTLINK = ""; // Webhook link.
  const WEBHOOKAVATARLINK = ""; // Webhook avatar link. (png, jpg...)
  const ATDISCORD = "<@248514207958433802>"; // User or role to @ when the webhook posts the report.
  const WEBHOOKNAME = ""; // webhook name.

  // For each field in the google form, grabs the data, and stores it into a local variable to be processed.
  for each(field in REPONSE) {
  
    // Get the question.
    var question = field.getItem().getTitle();
    
    // If the field contains files, get the file's links (WIP).
    if (field.getItem().getType().toString() == "FILE_UPLOAD") {
  
      try {
        
        // String array of file links.
        var filesUrl = [];
        
        // We get the files IDs.
        var fileIds = field.getResponse();
      
        // For each fileId, get the file from the drive.
        if (fileIds.length > 0) {
          for (var i = 0; i < fileIds.length; i++) {
            var file = DriveApp.getFileById(fileIds[i]);
            var fileLink = file.getUrl();

            // We push the link of the screenshot stored in our shared folder to the array which will be send to the discord webhook.
            filesUrl.push("[Screenshot_" + i + "](" + fileLink + ")");
          }
        } else continue;
        
        // Once we got all the urls, just concatenate them to the answer, separated with a space.
        var answer = filesUrl.join(" ");
        
      } catch (err) {
        
        // if theres an error during this procedure, skip the proof part.
        console.error(err);
        continue;
      }
      
      // If it doesnt contains files, just process the answers.
    } else {
      
      // Gets the answer.
      var answer = field.getResponse();
      
      // If the user didn't answer a question, ignore that answer.
      if (!answer.length) continue;
      
      // One question can have multiple answers, as for example, there can be multiple screenshots in the same field (question),
      //    if it does, just concatenate everything into one sring separated by a coma.
      if (Array.isArray(answer)) answer = answer.join();
      
    }
    
    // Formats each answer to an embeed field (https://discordapp.com/developers/docs/resources/channel#embed-object-embed-field-structure).
    EMBEDFIELDS.push({
      "name": question,
      "value": answer,
      "inline": false,
    });
  }

  // Payload.
  const PAYLOAD = {
  "avatar_url": WEBHOOKAVATARLINK,
  "username": WEBHOOKNAME,
  "content": ATDISCORD,
  "embeds": [{
    "color": 15844367,
    "title": "Support Request",
    "fields": EMBEDFIELDS,
    "footer": {
      "text": "",
    }
  }]};

  // Prepares the HTTP Request.
  const OPTIONS = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(PAYLOAD)
  };

  // And sends the payload.
  UrlFetchApp.fetch(WEBHOOKPOSTLINK, OPTIONS);
}
