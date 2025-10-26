(function(){
  const logged = localStorage.getItem('loggedInUser');
  if (!logged) {
    alert('Please login first.');
    window.location.href = 'index.html';
  }
})();
