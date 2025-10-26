(function(){
  const createBtn = document.getElementById('createBtn');

  createBtn.addEventListener('click', () => {
    const fullname = document.getElementById('fullname').value.trim();
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;

    if (!fullname || !username || !password) {
      alert('Please fill all fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === username)) {
      alert('Username already exists. Pick another.');
      return;
    }

    users.push({username, password, fullName: fullname});
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created! You can now log in.');
    window.location.href = 'index.html';
  });
})();
