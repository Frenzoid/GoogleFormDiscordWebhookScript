// When the form gets submitted, this event (onSubmit) gets triggered.
function onSubmit(event) {
  
  // Form Constants:
  const FORM = FormApp.getActiveForm();                            // Gets the google docs form DOM object.
  const ALLRESPONSES = FORM.getResponses();                        // Gets all the form responses.
  const LATESTRESPONSE = ALLRESPONSES[ALLRESPONSES.length - 1];    // Gets the last form reponse submitted.
  const REPONSE = LATESTRESPONSE.getItemResponses();               // A response to one question item within the form.
  const EMBEDFIELDS = [];                                          // Embed's fields array (https://discordapp.com/developers/docs/resources/channel#embed-object-embed-field-structure).
  
  // Webhook's Constants:
  const WEBHOOKPOSTLINK = "";
  const WEBHOOKAVATARLINK = "";
  const ATDISCORD = "";                                            // User or role to @ when the webhook posts the report.
  const WEBHOOKNAME = "";

  // For each field in the google form, grabs the data, and stores it into a local variable to be processed.
  for each (field in REPONSE) {

    // Get the questi
    var question = field.getItem().getTitle();
    
    // One question can have multiple answers, as for example, there can be multiple screenshots in the same field (question).
    try {
      var answers = field.getResponse().match(/[\s\S]{1,1024}/g) || [];
    } catch (exception) {
      var answers = [field.getResponse().toString()];
    }

    // If the user didn't answer a question, ignore that answer.
    if (!answers.length) continue;
  
    // Formats each answer to a embeed field (https://discordapp.com/developers/docs/resources/channel#embed-object-embed-field-structure).
    for each (answer in answers) {
      EMBEDFIELDS.push({
        "name": question,
        "value": answer,
        "inline": false,
      });
    }
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
