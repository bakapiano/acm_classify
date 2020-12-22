$.get("/frontend/current", function (data, status) {
    if (data.error == true) {
        $("#navbar-logout")[0].remove();
        $("#navbar-login")[0].style.visibility = "visible";
    } else {
        $("#navbar-login")[0].remove();
        $("#navbar-logout")[0].getElementsByTagName("i")[0].textContent = " " + data.data
        $("#navbar-logout")[0].style.visibility = "visible";
    }
});