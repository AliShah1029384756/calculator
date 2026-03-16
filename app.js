let currentInput = '';
let previousInput = '';
let operator = null;
let justEvaluated = false;

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

const opSymbols = { '/': '÷', '*': '×', '-': '−', '+': '+' };

function updateDisplay(value) {
  // Limit display length
  const str = String(value);
  resultEl.textContent = str.length > 12 ? parseFloat(value).toExponential(4) : str;
}

function handleNumber(val) {
  if (justEvaluated) {
    currentInput = '';
    justEvaluated = false;
  }
  if (val === '.' && currentInput.includes('.')) return;
  if (currentInput === '0' && val !== '.') currentInput = val;
  else currentInput += val;
  updateDisplay(currentInput);
}

function handleOperator(op) {
  justEvaluated = false;
  if (currentInput === '' && previousInput !== '') {
    operator = op;
    expressionEl.textContent = `${previousInput} ${opSymbols[op]}`;
    return;
  }
  if (previousInput !== '' && currentInput !== '') {
    calculate();
  }
  operator = op;
  previousInput = currentInput || previousInput;
  currentInput = '';
  expressionEl.textContent = `${previousInput} ${opSymbols[op]}`;

  // highlight active operator button
  document.querySelectorAll('.btn.operator').forEach(b => b.classList.remove('active-op'));
  const activeBtn = document.querySelector(`[data-value="${op}"]`);
  if (activeBtn) activeBtn.classList.add('active-op');
}

function calculate() {
  if (operator === null || previousInput === '' || currentInput === '') return;

  const a = parseFloat(previousInput);
  const b = parseFloat(currentInput);
  let res;

  switch (operator) {
    case '+': res = a + b; break;
    case '-': res = a - b; break;
    case '*': res = a * b; break;
    case '/':
      if (b === 0) { resultEl.textContent = 'Error'; reset(); return; }
      res = a / b;
      break;
  }

  expressionEl.textContent = `${previousInput} ${opSymbols[operator]} ${currentInput} =`;
  currentInput = String(parseFloat(res.toFixed(10)));
  previousInput = '';
  operator = null;
  justEvaluated = true;
  updateDisplay(currentInput);
  document.querySelectorAll('.btn.operator').forEach(b => b.classList.remove('active-op'));
}

function reset() {
  currentInput = '';
  previousInput = '';
  operator = null;
  justEvaluated = false;
  resultEl.textContent = '0';
  expressionEl.textContent = '';
}

function toggleSign() {
  if (!currentInput) return;
  currentInput = String(parseFloat(currentInput) * -1);
  updateDisplay(currentInput);
}

function applyPercent() {
  if (!currentInput) return;
  currentInput = String(parseFloat(currentInput) / 100);
  updateDisplay(currentInput);
}

// Button click handler
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    const action = btn.dataset.action;

    if (val !== undefined) {
      if (['+', '-', '*', '/'].includes(val)) handleOperator(val);
      else handleNumber(val);
    }
    if (action === 'clear') reset();
    if (action === 'equals') calculate();
    if (action === 'sign') toggleSign();
    if (action === 'percent') applyPercent();
  });
});

// Keyboard support
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
  else if (e.key === '.') handleNumber('.');
  else if (['+', '-', '*', '/'].includes(e.key)) handleOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
  }
  else if (e.key === 'Escape') reset();
});
