(function(){
  const titleEl = document.getElementById('title');
  const descEl = document.getElementById('desc');
  const qwrap = document.getElementById('qwrap');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const submitBtn = document.getElementById('submit');

  const quizId = localStorage.getItem('joinQuizId');
  const pin = localStorage.getItem('joinPin');
  if (!quizId || !pin) {
    alert('No quiz session found. Enter PIN from Player room.');
    window.location.href = 'player-room.html';
    return;
  }

  const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) { alert('Quiz not found.'); window.location.href='player-room.html'; return; }

  titleEl.textContent = quiz.title;
  descEl.textContent = quiz.desc || '';

  let idx = 0;
  const answers = new Array(quiz.questions.length).fill(null);

  function render() {
    const q = quiz.questions[idx];
    qwrap.innerHTML = `<div class="question">Q${idx+1}. ${escapeHtml(q.question)}</div><div class="options">${renderOptions(q, idx)}</div>`;
    prevBtn.disabled = idx===0;
    nextBtn.disabled = idx===quiz.questions.length-1;
  }

  function escapeHtml(s=''){ return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderOptions(q, qi) {
    if (quiz.type === 'mcq') {
      return q.options.map((opt,i)=>{
        const checked = answers[qi]===(i+'') ? 'checked':'' ;
        return `<label><input type="radio" name="opt${qi}" value="${i}" ${checked} onchange="window.quizAnswer(${qi}, this.value)" /> ${escapeHtml(opt)}</label>`;
      }).join('');
    } else if (quiz.type === 'tf') {
      return ['True','False'].map(t=>{
        const val = t.toLowerCase() === 'true' ? 'true':'false';
        const checked = answers[qi] === val ? 'checked':'';
        return `<label><input type="radio" name="opt${qi}" value="${val}" ${checked} onchange="window.quizAnswer(${qi}, this.value)" /> ${t}</label>`;
      }).join('');
    } else {
      const val = answers[qi]||'';
      return `<textarea placeholder="Type your answer..." rows="4" style="width:100%;padding:8px;border-radius:8px" onchange="window.quizAnswer(${qi}, this.value)">${escapeHtml(val)}</textarea>`;
    }
  }
  window.quizAnswer = function(qIndex, value) {
    answers[qIndex] = value;
  };

  prevBtn.addEventListener('click', () => { if (idx>0){ idx--; render(); }});
  nextBtn.addEventListener('click', () => { if (idx<quiz.questions.length-1){ idx++; render(); }});
  submitBtn.addEventListener('click', () => {
    let score = 0;
    let total = quiz.questions.length;
    quiz.questions.forEach((q,i)=>{
      const given = answers[i];
      if (quiz.type === 'mcq') {
        if (given !== null && given !== '' && q.answer !== '' && (q.answer + '') === (given + '')) score++;
      } else if (quiz.type === 'tf') {
        if (given !== null && given !== '' && q.answer === given) score++;
      } else {
      
      }
    });
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    const user = localStorage.getItem('loggedInUser') || localStorage.getItem('guestName') || 'Guest';
    history.push({
      id: 'hist_'+Date.now(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      user,
      answers,
      score: score,
      maxScore: total,
      when: new Date().toISOString(),
      pinUsed: pin
    });
    localStorage.setItem('history', JSON.stringify(history));
    alert('Quiz submitted! Score: '+score+' / '+total);
    localStorage.removeItem('guestName');
    localStorage.removeItem('joinPin');
    localStorage.removeItem('joinQuizId');
    window.location.href = 'history.html';
  });

  render();
})();
