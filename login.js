(function(){
  const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
if (!username || !password) {
      alert('Please enter username and password.');
      return;
    }
const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', username);
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid credentials. If you are new, create an account first.');
    }
  });
  if (!localStorage.getItem('users')) {
    const demo = [{username:'admin', password:'admin123', fullName:'Admin'}];
    localStorage.setItem('users', JSON.stringify(demo));
  }
})();
