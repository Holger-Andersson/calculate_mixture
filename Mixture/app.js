// app.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Ladda Google Fonts + global CSS
  const pre1 = document.createElement('link');
  pre1.rel = 'preconnect'; pre1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(pre1);

  const pre2 = document.createElement('link');
  pre2.rel = 'preconnect'; pre2.href = 'https://fonts.gstatic.com';
  pre2.crossOrigin = '';
  document.head.appendChild(pre2);

  const fonts = document.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap';
  document.head.appendChild(fonts);

  const globalStyle = document.createElement('link');
  globalStyle.rel = 'stylesheet';
  globalStyle.href = 'style.css';
  document.head.appendChild(globalStyle);

  // 2) Hitta root och bygg kalkylatorn
  const root = document.querySelector('#root');

  const container = document.createElement('div');
  container.className = 'container';

  // Header
  const header = document.createElement('header');
  header.textContent = 'KOMPOSITKUNGEN 2.0';
  container.appendChild(header);

  // Form
  const form = document.createElement('form');
  form.id = 'mix-form';

  // Material-väljare
  const groupMaterial = document.createElement('div');
  groupMaterial.className = 'form-group';
  const labelMat = document.createElement('label');
  labelMat.htmlFor = 'material';
  labelMat.textContent = 'Välj material:';
  const select = document.createElement('select');
  select.id = 'material';
  select.name = 'material';
  ['855','858','BX2','MX1'].forEach(val => {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
  groupMaterial.append(labelMat, select);
  form.appendChild(groupMaterial);

  // A-del mängd
  const groupAmount = document.createElement('div');
  groupAmount.className = 'form-group';
  const labelAmt = document.createElement('label');
  labelAmt.htmlFor = 'product_a_amount';
  labelAmt.textContent = 'Hur många gram A-del?';
  const inputAmt = document.createElement('input');
  inputAmt.type = 'number';
  inputAmt.id = 'product_a_amount';
  inputAmt.name = 'product_a_amount';
  inputAmt.step = '1';
  inputAmt.required = true;
  inputAmt.placeholder = 'Gram';
  groupAmount.append(labelAmt, inputAmt);
  form.appendChild(groupAmount);

  // Submit-knapp
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Beräkna';
  form.appendChild(submitBtn);

  container.appendChild(form);

  // Resultat-div
  const resultDiv = document.createElement('div');
  resultDiv.id = 'result-container';
  resultDiv.className = 'result';
  container.appendChild(resultDiv);

  // Lägg kalkylatorn i DOM
  root.appendChild(container);

  // 3) Kalkylator-logik
  const materials = {
    "855": [1, 6.8],
    "858": [1, 4],
    "BX2": [1, 4],
    "MX1": [3.3, 1, 22.6]
  };

  form.addEventListener('submit', evt => {
    evt.preventDefault();

    const mat = select.value;
    const aAmount = parseFloat(inputAmt.value);
    const ratios = materials[mat];
    let result = { a: 0, b: 0, c: '' };

    if (ratios.length === 2) {
      const [rA, rB] = ratios;
      const bVal = aAmount / rB;
      result = { a: Math.round(aAmount), b: Math.round(bVal), c: '' };
    } else {
      const [rA, rB, rC] = ratios;
      const bVal = (aAmount * rB) / rA;
      const cVal = (aAmount * rC) / rA;
      result = {
        a: Math.round(aAmount),
        b: Math.round(bVal),
        c: Math.round(cVal)
      };
    }

    // Rendera resultat
    resultDiv.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.textContent = 'Resultat:';
    resultDiv.appendChild(h2);

    const table = document.createElement('table');
    const headRow = document.createElement('tr');
    ['Del','Mängd'].forEach(txt => {
      const th = document.createElement('th');
      th.textContent = txt;
      headRow.appendChild(th);
    });
    table.appendChild(headRow);

    // A
    const rowA = document.createElement('tr');
    ['A-del:', result.a].forEach(txt => {
      const td = document.createElement('td');
      td.textContent = txt;
      rowA.appendChild(td);
    });
    table.appendChild(rowA);

    // B
    const rowB = document.createElement('tr');
    ['B-del:', result.b].forEach(txt => {
      const td = document.createElement('td');
      td.textContent = txt;
      rowB.appendChild(td);
    });
    table.appendChild(rowB);

    // C om finns
    if (result.c !== '') {
      const rowC = document.createElement('tr');
      ['C-del:', result.c].forEach(txt => {
        const td = document.createElement('td');
        td.textContent = txt;
        rowC.appendChild(td);
      });
      table.appendChild(rowC);
    }

    resultDiv.appendChild(table);
  });

  // 4) Timer-widget: skapa root och initiera
  const timerWrapper = document.createElement('div');
  timerWrapper.id = 'timer-widget';
  timerWrapper.classList.add('timer-wrapper');
  root.appendChild(timerWrapper);

  // 5) Starta timern
  new TimerWidget('#timer-widget');
});
