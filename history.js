(function(){
  const logged = localStorage.getItem('loggedInUser');
  if (!logged) { alert('Please login to view history.'); window.location.href='index.html'; return; }
const hostedList = document.getElementById('hostedList');
  const playedList = document.getElementById('playedList');
const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
  const history = JSON.parse(localStorage.getItem('history') || '[]');
const myHosted = quizzes.filter(q => q.owner === logged);
  const myPlayed = history.filter(h => h.user === logged);
function renderHosted() {
    if (myHosted.length === 0) {
      hostedList.innerHTML = '<div class="meta">No hosted quizzes yet.</div>';
      return;
    }
    hostedList.innerHTML = myHosted.map(q => `
      <div class="item">
        <div>
          <div style="font-weight:700">${q.title}</div>
          <div class="meta">${q.type.toUpperCase()} • ${q.questions.length} questions • ${q.published ? 'Published':'Not published'}</div>
        </div>
        <div>
          <a class="btn" href="create-quiz.html?edit=${q.id}">Edit</a>
          <a class="btn" href="publish.html">Manage</a>
        </div>
      </div>
    `).join('');
  }

  function renderPlayed() {
    if (myPlayed.length === 0) {
      playedList.innerHTML = '<div class="meta">No plays recorded yet.</div>';
      return;
    }
    const sorted = myPlayed.sort((a,b)=> new Date(b.when) - new Date(a.when));
    playedList.innerHTML = sorted.map(h => `
      <div class="item">
        <div>
          <div style="font-weight:700">${h.quizTitle}</div>
          <div class="meta">${new Date(h.when).toLocaleString()} • Score: ${h.score}/${h.maxScore}</div>
        </div>
        <div>
          <a class="btn" href="quiz.html">View</a>
        </div>
      </div>
    `).join('');
  }

  renderHosted();
  renderPlayed();
})();
