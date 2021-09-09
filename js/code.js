var urlBase = "/LAMPAPI";
var extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  var login = document.getElementById("loginName").value;
  var password = document.getElementById("loginPassword").value;
  var hash = md5(password);

  document.getElementById("loginResult").innerHTML = "";

  var tmp = { login: login, password: hash };
  //	var tmp = {login:login,password:hash};
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

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "color.html";
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
  var loginName = document.getElementById("loginName").value;
  var password = document.getElementById("loginPassword").value;
  var confirmPassword = document.getElementById("confirmLoginPassword").value;

  // if passwords don't match when registering
  if (password.localeCompare(confirmPassword) !== 0) {
    // document.getElementById("loginResult").innerHTML = err.message;
    alert("Passwords Don't Match");
    return;
  }
  var hash = md5(password);

  document.getElementById("loginResult").innerHTML = "";
  // alert(loginName);
  //   var tmp = { login: login, password: password };
  var tmp = {
    firstName: firstName,
    lastName: lastName,
    loginName: loginName,
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
          // document.getElementById("loginResult").innerHTML =
          //   "User Already Registered With These Credentials";
          alert("User Already Registered With These Credentials");
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;
        loginName = jsonObject.loginName;
        // password = jsonObject.password;

        saveCookie();

        window.location.href = "index.html";
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
    "loginName=" +
    loginName +
    "firstName=" +
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
    } else if (tokens[0] == "loginName") {
      loginName = tokens[1];
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

function addColor() {
  var newColor = document.getElementById("colorText").value;
  document.getElementById("colorAddResult").innerHTML = "";

  var tmp = { color: newColor, userId, userId };
  var jsonPayload = JSON.stringify(tmp);

  var url = urlBase + "/AddColor." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("colorAddResult").innerHTML =
          "Color has been added";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("colorAddResult").innerHTML = err.message;
  }
}

function searchColor() {
  var srch = document.getElementById("searchText").value;
  document.getElementById("colorSearchResult").innerHTML = "";

  var colorList = "";

  var tmp = { search: srch, userId: userId };
  var jsonPayload = JSON.stringify(tmp);

  var url = urlBase + "/SearchColors." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("colorSearchResult").innerHTML =
          "Color(s) has been retrieved";
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
    document.getElementById("colorSearchResult").innerHTML = err.message;
  }
}
