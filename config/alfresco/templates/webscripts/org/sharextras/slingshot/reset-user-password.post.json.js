/**
 * Reset User Password script
 * 
 * @method POST
 * @param json {string}
 *    {
 *       email: "email"
 *    }
 */
model.result = false;
model.message = "";
var s = new XML(config.script);

function getRandomNum(lbound, ubound)
{
   return (Math.floor(Math.random() * (ubound - lbound)) + lbound);
}
function getRandomChar()
{
   var chars = s["pw-chars"].toString();
   return chars.charAt(getRandomNum(0, chars.length));
}
function getRandomPassword(n)
{
   var password = "";
   for (var i=0; i<n; i++)
   {
      password += getRandomChar();
   }
   return password;
}
function resetPassword(u)
{
   var pwlen = parseInt(s["pw-length"].toString(), 10);
   // Auto-generate a password if not specified
   if (u.password == null || u.password == "")
   {
      u.password = getRandomPassword(pwlen);
   }
   people.setPassword(u.userName, u.password);
   return u;
}
function mailResetPasswordNotification(u)
{
   // create mail action
   var mail = actions.create("mail"), fromName = person.properties.firstName + " " + person.properties.lastName;
   mail.parameters.to = u.email;
   mail.parameters.subject = msg.get("subject.text");
   mail.parameters.text = msg.get("template.passwordReset", [u.firstName, u.userName, u.password, fromName]);
   // execute action against a space
   mail.execute(companyhome);
   return mail;
}
function logResetPasswordResults(users)
{
   var logContent = "";
   for (var i=0; i<users.length; i++)
   {
      logContent += (users[i].userName + "," + users[i].password + "\n");
   }
   var d = new Date();
   var logFile = userhome.createFile("reset_password_" + d.getTime() + ".csv");
   logFile.content = logContent;
   logFile.save();
   return logFile;
}
function userToObject(u)
{
   return {
      "firstName" : u.properties.firstName,
      "lastName" : u.properties.lastName,
      "email" : u.properties.email.toLowerCase(),
      "userName" : u.properties.userName,
      "password" : null
   };
}
function getUserByUserName(username)
{
   return people.getPerson(username);
}
function getUsersByEmail(email)
{
   var filter = "email:" + email,
      maxResults = 10,
      peopleCollection = people.getPeople(filter, maxResults);
   return peopleCollection;
}
function userIsMember(u, g)
{
   var members = people.getMembers(g);
   for (var i=0; i<members.length; i++)
   {
      if (members[i].properties.userName == u.properties.userName)
      {
         return true;
      }
   }
   return false;
}
function main()
{
   var user, u, email, users, 
      logResults = s["log-resets"].toString() == "true", 
      disallowedUsers = s["disallowed-users"].toString().split(",");
   
   if ((json.isNull("email")) || (json.get("email") == null) || (json.get("email").length() == 0)) 
   {
      status.setCode(status.STATUS_BAD_REQUEST, msg.get("error.noEmail"));
      status.redirect = true;
      return;
   }
   
   email = json.get("email");
   users = getUsersByEmail(email);
   
   if (users.length == 0) 
   {
      status.setCode(status.STATUS_NOT_FOUND, msg.get("error.notFound", [email]));
      status.redirect = true;
      return;
   }

   if (users.length > 1) 
   {
      status.setCode(status.STATUS_BAD_REQUEST, msg.get("error.multiple"));
      status.redirect = true;
      return;
   }
   
   user = search.findNode(users[0]);

   if (!people.isAccountEnabled(user.properties.userName))
   {
      status.setCode(status.STATUS_FORBIDDEN, msg.get("error.disabled"));
      status.redirect = true;
      return;
   }
   
   for ( var i = 0; i < disallowedUsers.length; i++)
   {
      if (user.properties.userName == disallowedUsers[i])
      {
         status.setCode(status.STATUS_FORBIDDEN, msg.get("error.disallowed"));
         status.redirect = true;
         return;
      }
   }
   
   var uresults = search.query({
      language: "lucene",
      store: "user://alfrescoUserStore",
      query: "PATH:\"/\\{http\\://www.alfresco.org/model/system/1.0\\}system/\\{http\\://www.alfresco.org/model/system/1.0\\}people/\\{http\\://www.alfresco.org/model/user/1.0\\}user\" +@\\{http\\://www.alfresco.org/model/user/1.0\\}username:" + user.properties.userName
   });
   
   // Check that the user is local (i.e. not an LDAP user)
   if (uresults.length != 1)
   {
      status.setCode(status.STATUS_BAD_REQUEST, msg.get("error.notLocal"));
      status.redirect = true;
      return;
   }
   
   // Reset the password
   u = resetPassword(userToObject(user));
   
   // Send e-mail confirmation
   try
   {
      mailResetPasswordNotification(u);
   }
   catch (e) {
      status.setCode(status.STATUS_INTERNAL_SERVER_ERROR, msg.get("error.mail"));
      status.redirect = true;
      return;
   }
   
   model.success = true;
   
   if (logResults)
   {
      model.resultsLog = logResetPasswordResults([u]);
   }
}

main();