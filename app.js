const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us19.api.mailchimp.com/3.0/lists/ffe10370ab";

  const options = {
    method: "POST",
    auth: "petar1:186b1f03ba64289029a013d672399f63-us19"
  }

  const request = https.request(url, options, function(response) {
    statusCode = response.statusCode;

    if(statusCode === 200)
    {
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
    console.log(statusCode);
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res)
{
  res.redirect("/");
})

// API Key
// 186b1f03ba64289029a013d672399f63-us19

// List ID
// ffe10370ab
