(function(){
  const select = document.getElementById('quizSelect');
  const publishBtn = document.getElementById('publishBtn');
  const revokeBtn = document.getElementById('revokeBtn');
  const pinArea = document.getElementById('pinArea');
  const pinDisplay = document.getElementById('pinDisplay');

  const logged = localStorage.getItem('loggedInUser');
  if (!logged) {
    alert('Please login first.');
    window.location.href = 'index.html';
  }

  function loadQuizzes(){
    const all = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const my = all.filter(q => q.owner === logged);
    select.innerHTML = '';
    if (my.length === 0) {
      select.innerHTML = '<option value="">No saved quizzes — create one first</option>';
      publishBtn.disabled = true;
      revokeBtn.disabled = true;
      pinArea.style.display = 'none';
      return;
    }
    my.forEach(q => {
      const o = document.createElement('option');
      o.value = q.id; o.textContent = `${q.title} (${q.type.toUpperCase()}) ${q.published ? '• Published':''}`;
      select.appendChild(o);
    });
    publishBtn.disabled = false;
    revokeBtn.disabled = false;
    showActivePin();
  }

  function genPin() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  }

  function showActivePin() {
    const active = JSON.parse(localStorage.getItem('activePins') || '{}');
    const selectedId = select.value || (select.options[0] && select.options[0].value);
    if (selectedId && active[selectedId]) {
      pinArea.style.display = 'block';
      pinDisplay.textContent = active[selectedId];
    } else {
      pinArea.style.display = 'none';
    }
  }
publishBtn.addEventListener('click', () => {
    const id = select.value;
    if (!id) { alert('Choose a quiz to publish.'); return; }
    const all = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const idx = all.findIndex(q => q.id === id);
    if (idx === -1) { alert('Quiz not found.'); return; }
    const pin = genPin();
    const active = JSON.parse(localStorage.getItem('activePins') || '{}');
    active[id] = pin;
    localStorage.setItem('activePins', JSON.stringify(active));
    all[idx].published = true;
    localStorage.setItem('quizzes', JSON.stringify(all));
    alert('Quiz published. PIN generated: ' + pin);
    showActivePin();
  });

  revokeBtn.addEventListener('click', () => {
    const id = select.value;
    if (!id) return alert('Select a quiz.');
    const active = JSON.parse(localStorage.getItem('activePins') || '{}');
    if (active[id]) {
      delete active[id];
      localStorage.setItem('activePins', JSON.stringify(active));
      const all = JSON.parse(localStorage.getItem('quizzes') || '[]');
      const idx = all.findIndex(q => q.id === id);
      if (idx>-1){ all[idx].published=false; localStorage.setItem('quizzes', JSON.stringify(all)); }
      alert('PIN revoked and quiz unpublished.');
      showActivePin();
    } else {
      alert('No active PIN for selected quiz.');
    }
  });
select.addEventListener('change', showActivePin);
  loadQuizzes();
})();
