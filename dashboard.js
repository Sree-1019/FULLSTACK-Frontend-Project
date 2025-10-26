const username = localStorage.getItem("loggedInUser");
if (username) {
  document.getElementById("userName").textContent = username;
} else {
  window.location.href = "index.html";
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});
