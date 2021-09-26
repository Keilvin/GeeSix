var urlBase = "/LAMPAPI";
var extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";
var email = "";
var userName = "";

autosearch = 1;
function turnAutoSearchOff() {
  autosearch = 0;
  document.removeEventListener("keypress", logKey);
}
function turnAutoSearchOn() {
  autosearch = 1;
  document.addEventListener("keypress", logKey);
}

function getAutoSearchState() {
  return autosearch;
}

if (getAutoSearchState() === 1) {
  document.addEventListener("keypress", logKey);
  function logKey(e) {
    searchContacts();
  }
}

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
        turnAutoSearchOff();
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
    ",email=" +
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
    window.location.href = "login.html";
  } else {
    document.getElementById("userName").innerHTML =
      "Logged in as " + firstName + " " + lastName;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  email = "";
  userName = "";
  document.cookie =
    "userName=" +
    userName +
    ",email=" +
    email +
    ",firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "login.html";
}

function addContact() {
  var first = document.getElementById("firstName").value;
  var last = document.getElementById("lastName").value;
  var numberr = document.getElementById("number").value;
  document.getElementById("added").innerHTML = "";
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
        document.getElementById("added").innerHTML = "Contact has been added";
        searchContacts();
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("added").innerHTML = err.message;
  }
}

// getters and setters -Brian Moon
var contactID = 0;
function setContactID(id) {
  contactID = id;
}
function getContactID() {
  return contactID;
}

var searchy = "";
function setSearch(search) {
  searchy = search;
}
function getSearch() {
  return searchy;
}

var firstNameNew = "";
function setFirstName(fn) {
  firstNameNew = fn;
}
function getFirstName() {
  return firstNameNew;
}

var lastNameNew = "";
function setLastName(ln) {
  lastNameNew = ln;
}
function getLastName() {
  return lastNameNew;
}

var numberNew = "";
function setLastName(nn) {
  numberNew = nn;
}
function getLastName() {
  return numberNew;
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
        var jsonObject = JSON.parse(xhr.responseText);
        if (jsonObject.results.length > 0) {
          // document.getElementById("contactSearchResult").innerHTML =
          //   "Contacts have been retrieved";

          colorList += "<table class='table'>\n";
          colorList += "<thead>\n";
          colorList += "<tr>\n";
          colorList += "<th scope='col'></th>\n";
          colorList += "<th scope='col'>First Name</th>\n";
          colorList += "<th scope='col'>Last Name</th>\n";
          colorList += "<th scope='col'>Number</th>\n";
          colorList += "</tr>\n";
          colorList += "</thead>\n";
          colorList += "<tbody>\n";
          for (var i = 0; i < jsonObject.results.length; i++) {
            colorList += "<tr>\n";
            colorList += "<td>";
            colorList += "<button id='";
            colorList += jsonObject.results[i];
            colorList += "'";
            colorList +=
              "type='button' class='btn btn-outline-secondary' data-bs-toggle='modal' data-bs-target='#exampleModal' onclick='setContactID(";
            colorList += jsonObject.results[i];
            colorList += ");turnAutoSearchOff();'>";
            colorList += "<i class='fa fa-pencil'></i> Edit";
            colorList += "</button>\n";
            colorList += "<span>";
            colorList += "<button id='";
            colorList += jsonObject.results[i];
            colorList += "'";
            colorList +=
              "type='button' class='btn btn-outline-secondary' data-bs-toggle='modal' data-bs-target='#exampleModal2' onclick='setContactID(";
            colorList += jsonObject.results[i];
            i++;
            colorList += ");'>";
            colorList += "<i class='fa fa-trash'></i> Delete";
            colorList += "</button>\n";
            colorList += "</span>";
            colorList +=
              "<div class='modal fade' id='exampleModal' tabindex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>\n";
            colorList += "<div class='modal-dialog'>\n";
            colorList += "<div class='modal-content'>\n";
            colorList += "<div class='modal-header'>\n";
            colorList +=
              "<h5 class='modal-title' id='exampleModalLabel'>Edit Contact</h5>\n";
            colorList +=
              "<button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>\n";
            colorList += "</div>\n";
            colorList += "<div class='modal-body'>\n";
            colorList += "<div class='mb-1'>\n";
            colorList +=
              "<label for='firstName' class='form-label'>Add Contacts</label>\n";
            colorList +=
              "<input type='text' class='form-control' id='firstNameEdit' name='firstNameEdit' placeholder='Edit First Name'/>\n";
            colorList +=
              "<input type='text' class='form-control' id='lastNameEdit' name='lastNameEdit' placeholder='Edit Last Name'/>\n";
            colorList +=
              "<input type='text' class='form-control' id='numberEdit' name='numberEdit' placeholder='Edit Number'/>\n";
            colorList += "<span id='contactAddResult'></span>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";
            colorList += "<div class='modal-footer'>\n";
            colorList +=
              "<button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button>\n";
            colorList +=
              "<button type='submit' id='save' class='btn btn-primary' data-bs-dismiss='modal' onclick='editContact(";
            colorList += ");turnAutoSearchOn();' >Save changes</button>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";

            colorList +=
              "<div class='modal fade' id='exampleModal2' tabindex='-1' aria-labelledby='exampleModalLabel2' aria-hidden='true'>\n";
            colorList += "<div class='modal-dialog'>\n";
            colorList += "<div class='modal-content'>\n";
            colorList += "<div class='modal-header'>\n";
            colorList +=
              "<h5 class='modal-title' id='exampleModalLabel2'>Delete Contact</h5>\n";
            colorList +=
              "<button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>\n";
            colorList += "</div>\n";
            colorList += "<div class='modal-body'>\n";
            colorList += "<p>Click Delete User To Confirm Deletion</p>";
            colorList += "</div>\n";
            colorList += "<div class='modal-footer'>\n";
            colorList +=
              "<button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button>\n";
            colorList +=
              "<button type='submit' id='save' class='btn btn-primary' data-bs-dismiss='modal' onclick='deleteContact(";
            colorList += ");' >Delete Contact</button>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";

            colorList += "</td>\n";
            colorList += "<td>";
            colorList += jsonObject.results[i];
            // setSearch(jsonObject.results[i]);
            colorList += "</td>\n";
            i++;
            colorList += "<td>";
            colorList += jsonObject.results[i];
            colorList += "</td>\n";
            i++;
            colorList += "<td>";
            colorList += jsonObject.results[i];
            colorList += "</td>\n";
            colorList += "</tr>\n";
            // if (i < jsonObject.results.length - 1) {
            //   colorList += "<br />\r\n";
            // }
          }
          colorList += "</tbody>\n";
          colorList += "</table>\n";
          // saveCookie();
          document.getElementsByTagName("p")[0].innerHTML = colorList;
        } else {
          document.getElementsByTagName("p")[0].innerHTML = "No Contacts Found";
        }
      } else {
        document.getElementsByTagName("p")[0].innerHTML = "No Contacts Found";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}

function searchContacts2() {
  var search = getSearch();
  document.getElementById("contactSearchResult").innerHTML = "";

  var colorList = "";

  var tmp = { search: search, userId: userId };
  var jsonPayload = JSON.stringify(tmp);

  var url = urlBase + "/Search." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var jsonObject = JSON.parse(xhr.responseText);
        if (jsonObject.results.length > 0) {
          // document.getElementById("contactSearchResult").innerHTML =
          //   "Contacts have been retrieved";

          colorList += "<table class='table'>\n";
          colorList += "<thead>\n";
          colorList += "<tr>\n";
          colorList += "<th scope='col'></th>\n";
          colorList += "<th scope='col'>First Name</th>\n";
          colorList += "<th scope='col'>Last Name</th>\n";
          colorList += "<th scope='col'>Number</th>\n";
          colorList += "</tr>\n";
          colorList += "</thead>\n";
          colorList += "<tbody>\n";
          for (var i = 0; i < jsonObject.results.length; i++) {
            colorList += "<tr>\n";
            colorList += "<td>";
            colorList += "<button id='";
            colorList += jsonObject.results[i];
            colorList += "'";
            colorList +=
              "type='button' class='btn btn-outline-secondary' data-bs-toggle='modal' data-bs-target='#exampleModal' onclick='setContactID(";
            colorList += jsonObject.results[i];
            colorList += ");turnAutoSearchOff();'>";
            colorList += "<i class='fa fa-pencil'></i> Edit";
            colorList += "</button>\n";
            colorList += "<span>";
            colorList += "<button id='";
            colorList += jsonObject.results[i];
            colorList += "'";
            colorList +=
              "type='button' class='btn btn-outline-secondary' data-bs-toggle='modal' data-bs-target='#exampleModal2' onclick='setContactID(";
            colorList += jsonObject.results[i];
            i++;
            colorList += ");'>";
            colorList += "<i class='fa fa-trash'></i> Delete";
            colorList += "</button>\n";
            colorList += "</span>";
            colorList +=
              "<div class='modal fade' id='exampleModal' tabindex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>\n";
            colorList += "<div class='modal-dialog'>\n";
            colorList += "<div class='modal-content'>\n";
            colorList += "<div class='modal-header'>\n";
            colorList +=
              "<h5 class='modal-title' id='exampleModalLabel'>Edit Contact</h5>\n";
            colorList +=
              "<button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>\n";
            colorList += "</div>\n";
            colorList += "<div class='modal-body'>\n";
            colorList += "<div class='mb-1'>\n";
            colorList +=
              "<label for='firstName' class='form-label'>Add Contacts</label>\n";
            colorList +=
              "<input type='text' class='form-control' id='firstNameEdit' name='firstNameEdit' placeholder='Edit First Name'/>\n";
            colorList +=
              "<input type='text' class='form-control' id='lastNameEdit' name='lastNameEdit' placeholder='Edit Last Name'/>\n";
            colorList +=
              "<input type='text' class='form-control' id='numberEdit' name='numberEdit' placeholder='Edit Number'/>\n";
            colorList += "<span id='contactAddResult'></span>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";
            colorList += "<div class='modal-footer'>\n";
            colorList +=
              "<button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button>\n";
            colorList +=
              "<button type='submit' id='save' class='btn btn-primary' data-bs-dismiss='modal' onclick='editContact(";
            colorList += ");turnAutoSearchOn();' >Save changes</button>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";

            colorList +=
              "<div class='modal fade' id='exampleModal2' tabindex='-1' aria-labelledby='exampleModalLabel2' aria-hidden='true'>\n";
            colorList += "<div class='modal-dialog'>\n";
            colorList += "<div class='modal-content'>\n";
            colorList += "<div class='modal-header'>\n";
            colorList +=
              "<h5 class='modal-title' id='exampleModalLabel2'>Delete Contact</h5>\n";
            colorList +=
              "<button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>\n";
            colorList += "</div>\n";
            colorList += "<div class='modal-body'>\n";
            colorList += "<p>Click Delete User To Confirm Deletion</p>";
            colorList += "</div>\n";
            colorList += "<div class='modal-footer'>\n";
            colorList +=
              "<button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button>\n";
            colorList +=
              "<button type='submit' id='save' class='btn btn-primary' data-bs-dismiss='modal' onclick='deleteContact(";
            colorList += ");' >Delete Contact</button>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";
            colorList += "</div>\n";

            colorList += "</td>\n";
            colorList += "<td>";
            colorList += jsonObject.results[i];
            // setSearch(jsonObject.results[i]);
            colorList += "</td>\n";
            i++;
            colorList += "<td>";
            colorList += jsonObject.results[i];
            colorList += "</td>\n";
            i++;
            colorList += "<td>";
            colorList += jsonObject.results[i];
            colorList += "</td>\n";
            colorList += "</tr>\n";
            // if (i < jsonObject.results.length - 1) {
            //   colorList += "<br />\r\n";
            // }
          }
          colorList += "</tbody>\n";
          colorList += "</table>\n";
          // saveCookie();
          document.getElementsByTagName("p")[0].innerHTML = colorList;
        } else {
          colorList = "";
          document.getElementsByTagName("p")[0].innerHTML = colorList;
          document.getElementsByTagName("p")[0].innerHTML = "No Contacts Found";
        }
      } else {
        document.getElementsByTagName("p")[0].innerHTML = "No Contacts Found";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}

function editContact() {
  var id = getContactID();
  var first = document.getElementById("firstNameEdit").value;
  var last = document.getElementById("lastNameEdit").value;
  var numberr = document.getElementById("numberEdit").value;

  var tmp1 = {
    id: id,
  };
  var jsonPayload1 = JSON.stringify(tmp1);

  var url1 = urlBase + "/SearchAfterEdit." + extension;

  var xhr1 = new XMLHttpRequest();
  xhr1.open("POST", url1, true);
  xhr1.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr1.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // document.getElementById("contactEditResult").innerHTML =
        //   "Contact has been edited";
        var jsonObject1 = JSON.parse(xhr1.responseText);

        // searchContacts2();
        if (first === "") {
          first = jsonObject1.results[1];
        }
        if (last === "") {
          last = jsonObject1.results[2];
        }
        if (numberr === "") {
          numberr = jsonObject1.results[3];
        }
        var sendSearch = "";
        sendSearch += first;
        sendSearch += " ";
        sendSearch += last;
        sendSearch += " ";
        sendSearch += numberr;
        setSearch(sendSearch);
      }
    };
    xhr1.send(jsonPayload1);
  } catch (err) {
    // document.getElementById("contactEditResult").innerHTML = err.message;
  }

  // if (first === "") {
  //   // setSearch(first);
  // } else if (last === "") {
  //   // setSearch(last);
  // } else if (numberr === "") {
  //   // setSearch(numberr);
  // }
  // document.getElementById("colorAddResult").innerHTML = "";
  // alert(first);
  // alert(userId);
  var tmp = {
    id: id,
    firstNameEdit: first,
    lastNameEdit: last,
    numberEdit: numberr,
  };
  var jsonPayload = JSON.stringify(tmp);

  var url = urlBase + "/EditContact." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactEditResult").innerHTML =
          "Contact has been edited";
      }
      searchContacts2();
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactEditResult").innerHTML = err.message;
  }
}

function deleteContact() {
  var id = getContactID();
  var string = "";
  setSearch(string);
  // var first = document.getElementById("firstNameEdit").value;
  // var last = document.getElementById("lastNameEdit").value;
  // var numberr = document.getElementById("numberEdit").value;
  // document.getElementById("colorAddResult").innerHTML = "";
  // alert(first);
  // alert(userId);
  var tmp = {
    id: id,
  };
  var jsonPayload = JSON.stringify(tmp);

  var url = urlBase + "/DeleteContact." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactDeleteResult").innerHTML =
          "Contact has been deleted";
      }
      searchContacts2();
    };
    xhr.send(jsonPayload);
  } catch (err) {
    searchContacts2();
    document.getElementById("contactDeleteResult").innerHTML = err.message;
  }
}
