const loggedInUserId = localStorage.getItem("loggedInUser");

if(!loggedInUserId){
    alert("You must be logged in to access this page");
    window.location.href = "loginandsignup.html";

}