function ShowPassword()
{
  var x = document.getElementById("passwordBox");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}