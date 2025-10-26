(function(){
  const params = new URLSearchParams(location.search);
  const type = params.get('type') || 'mcq';
  const heading = document.getElementById('heading');
  heading.textContent = `Create Quiz — ${type.toUpperCase()}`;

  const questionArea = document.getElementById('questionArea');
  const addQ = document.getElementById('addQ');
  const saveBtn = document.getElementById('saveQuiz');

  let questions = [];

  function render() {
    questionArea.innerHTML = '';
    questions.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'qcard';
      div.innerHTML = `
        <div class="qhead">
          <div><span class="qnum">Q${i+1}</span> <input data-index="${i}" class="qtxt" value="${escapeHtml(q.question)}" /></div>
          <div><button class="del" data-index="${i}">Delete</button></div>
        </div>
        <div class="qbody">
          ${renderBody(q, i)}
        </div>
      `;
      questionArea.appendChild(div);
    });
    document.querySelectorAll('.del').forEach(btn=>{
      btn.onclick = () => {
        const idx = +btn.dataset.index;
        questions.splice(idx,1); render();
      };
    });

    document.querySelectorAll('.qtxt').forEach(inp=>{
      inp.onchange = () => {
        const idx = +inp.dataset.index;
        questions[idx].question = inp.value;
      };
    });

    document.querySelectorAll('.opt-input').forEach(inp=>{
      inp.onchange = () => {
        const idx = +inp.dataset.q;
        const optIdx = +inp.dataset.opt;
        questions[idx].options[optIdx] = inp.value;
      };
    });

    document.querySelectorAll('.answer-select').forEach(sel=>{
      sel.onchange = () => {
        const idx = +sel.dataset.q;
        questions[idx].answer = sel.value;
      };
    });
  }

  function escapeHtml(s=''){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderBody(q, i){
    if (type === 'mcq') {
      q.options = q.options || ['','','',''];
      return `
        <div style="margin-top:8px">
          <div style="margin-bottom:6px">Options:</div>
          ${q.options.map((o,oi)=>`<input class="opt-input" data-q="${i}" data-opt="${oi}" value="${escapeHtml(o)}" placeholder="Option ${oi+1}" />`).join('')}
        </div>
        <div style="margin-top:8px">Correct answer:
          <select class="answer-select" data-q="${i}">
            <option value="">--select--</option>
            ${q.options.map((_,oi)=>`<option ${q.answer===(oi+'' ) ? 'selected':''} value="${oi}">Option ${oi+1}</option>`)}
          </select>
        </div>
      `;
    } else if (type === 'tf') {
      q.options = ['True','False'];
      return `<div style="margin-top:8px">Answer:
        <select class="answer-select" data-q="${i}">
          <option value="">--select--</option>
          <option value="true" ${q.answer==='true'?'selected':''}>True</option>
          <option value="false" ${q.answer==='false'?'selected':''}>False</option>
        </select>
      </div>`;
    } else {
      return `<div style="margin-top:8px">Expected short answer (optional): <input class="small" data-index="${i}" value="${escapeHtml(q.answer||'')}" /></div>`;
    }
  }
addQ.addEventListener('click', () => {
    if (type === 'mcq') {
      questions.push({question:'', options:['','','',''], answer:''});
    } else if (type === 'tf') {
      questions.push({question:'', answer:''});
    } else {
      questions.push({question:'', answer:''});
    }
    render();
  });

  saveBtn.addEventListener('click', () => {
    const title = document.getElementById('quizTitle').value.trim();
    const desc = document.getElementById('quizDesc').value.trim();
    if (!title) { alert('Quiz title required'); return; }
    if (questions.length === 0) { alert('Add at least 1 question'); return; }
    const all = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const owner = localStorage.getItem('loggedInUser') || 'guest';
    const id = 'quiz_' + Date.now();
    const quiz = { id, title, desc, type, owner, questions, published: false, createdAt: new Date().toISOString() };

    all.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(all));

    alert('Quiz saved locally. You can publish it to generate a PIN.');
    window.location.href = 'dashboard.html';
  });
  render();
})();
