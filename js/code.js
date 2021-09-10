var urlBase = "/LAMPAPI";
var extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";
var email = "";
var userName = "";

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  var login = document.getElementById("userName").value;
  var password = document.getElementById("password").value;
  var hash = md5(password);

  document.getElementById("loginResult").innerHTML = "";

  var tmp = { userName: login, password: hash };
  var jsonPayload = JSON.stringify(tmp);

  var url = urlBase + "/Login." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;
        // alert(userId);
        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();
        // alert(userId);
        window.location.href = "contacts.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

function doRegister() {
  userId = 0;
  firstName = "";
  lastName = "";

  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;
  var userName = document.getElementById("userName").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("loginPassword").value;
  var confirmPassword = document.getElementById("confirmLoginPassword").value;

  // if passwords don't match when registering
  if (password.localeCompare(confirmPassword) !== 0) {
    alert("Passwords Don't Match");
    return;
  }
  var hash = md5(password);

  document.getElementById("loginResult").innerHTML = "";

  var tmp = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    email: email,
    password: hash,
  };
  var jsonPayload = JSON.stringify(tmp);

  var url = urlBase + "/Register." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId > 0) {
          alert("User Already Registered With These Credentials");
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;
        userName = jsonObject.userName;
        email = jsonObject.email;

        saveCookie();

        window.location.href = "login.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

function saveCookie() {
  var minutes = 20;
  var date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "userName=" +
    userName +
    "email=" +
    email +
    ",firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  userId = -1;
  var data = document.cookie;
  var splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    var thisOne = splits[i].trim();
    var tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    } else if (tokens[0] == "userName") {
      userName = tokens[1];
    } else if (tokens[0] == "email") {
      email = tokens[1];
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").innerHTML =
      "Logged in as " + firstName + " " + lastName;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

function addContact() {
  var first = document.getElementById("firstName").value;
  var last = document.getElementById("lastName").value;
  var numberr = document.getElementById("number").value;
  // document.getElementById("colorAddResult").innerHTML = "";
  // alert(first);
  // alert(userId);
  var tmp = {
    firstName: first,
    lastName: last,
    number: numberr,
    userId: userId,
  };
  var jsonPayload = JSON.stringify(tmp);

  var url = urlBase + "/AddContact." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactAddResult").innerHTML =
          "Contact has been added";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactAddResult").innerHTML = err.message;
  }
}

function searchContacts() {
  var srch = document.getElementById("search").value;
  document.getElementById("contactSearchResult").innerHTML = "";

  var colorList = "";

  var tmp = { search: srch, userId: userId };
  var jsonPayload = JSON.stringify(tmp);

  var url = urlBase + "/Search." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactSearchResult").innerHTML =
          "Contact(s) has been retrieved";
        var jsonObject = JSON.parse(xhr.responseText);

        for (var i = 0; i < jsonObject.results.length; i++) {
          colorList += jsonObject.results[i];
          if (i < jsonObject.results.length - 1) {
            colorList += "<br />\r\n";
          }
        }

        document.getElementsByTagName("p")[0].innerHTML = colorList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}
