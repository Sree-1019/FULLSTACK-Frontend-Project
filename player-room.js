(function(){
  const joinBtn = document.getElementById('joinBtn');
  const pinInput = document.getElementById('pinInput');
  const playerName = document.getElementById('playerName');
joinBtn.addEventListener('click', () => {
    const pin = pinInput.value.trim();
    if (!pin || pin.length < 6) { alert('Enter a valid 6-digit PIN.'); return; }
    const active = JSON.parse(localStorage.getItem('activePins') || '{}');
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const entries = Object.entries(active);
    const found = entries.find(([quizId, p]) => p === pin);
    if (!found) { alert('No active quiz with that PIN.'); return; }
    const quizId = found[0];
    localStorage.setItem('joinPin', pin);
    localStorage.setItem('joinQuizId', quizId);
    if (playerName.value.trim()) localStorage.setItem('guestName', playerName.value.trim());
    window.location.href = 'quiz.html';
  });
})();
