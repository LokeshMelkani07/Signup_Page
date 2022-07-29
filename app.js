const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");
const app = express();

// Though our CDN link is not static but  our signup.css and image we have used is a static
// To use static things we use express.static
// inside express.static we give name of the folder we need to make static
// Now we move our images and css signup.css inside the public folder
// In Signup.html do not change the path to public/images/img.jpg just let it remains like images/img.jpg and change css path to css/signup.css as we have now put signup.css inside css folder which is inside public folder
// Server automatically take static file and render them
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  // This format of using data like this is coming from mailchimp API Reference where we want to add the list of audience

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  // Our result should be a string so we stringify the data before making the post request
  const jsonData = JSON.stringify(data);
  // Now that we want to make a POST request so we use https for post request now
  const url = "https://us12.api.mailchimp.com/3.0/lists/21705639e3";
  const options = {
    method: "POST",
    auth: "lokesh:3982ec55d6af89e5d80af3b752e4b424-us12",
  };
  if (response.statusCode === 200) {
    res.sendFile(__dirname + "/success.html");
  } else {
    res.sendFile(__dirname + "/failure.html");
  }
  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

// post request for "try again" button of failure.html
app.post("/failure", function (req, res) {
  res.redirect("/");
});

// process.env.PORT means once we have deployed our app in heroku , listen it in any port heroku wants or 4000 if we run it on local server
app.listen(process.env.PORT || 4000, () => {
  console.log("app is opened at port 4000");
});

// API key for mailchimp : 3982ec55d6af89e5d80af3b752e4b424-us12
// Audience/List Id for Mailchimp : 21705639e3
