document.getElementById('mix-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Hämta värden från formuläret
    const material = document.getElementById('material').value;
    const productAAmount = parseFloat(document.getElementById('product_a_amount').value);
    
    // Materialens blandningsförhållanden
    const materials = {
      "855": [1, 6.8],
      "858": [1, 4],
      "BX2": [1, 4],
      "MX1": [3.3, 1, 22.6]
    };
  
    const ratios = materials[material];
    let result = {};
    
    if (ratios.length === 2) {
      // Två-dels blandning
      const ratioA = ratios[0],
            ratioB = ratios[1];
      const productBAmount = productAAmount / ratioB;
      result = {
        a: parseInt(productAAmount),
        b: parseInt(productBAmount),
        c: '' // Ingen C-del
      };
    } else if (ratios.length === 3) {
      // Tre-dels blandning
      const ratioA = ratios[0],
            ratioB = ratios[1],
            ratioC = ratios[2];
      const productBAmount = (productAAmount * ratioB) / ratioA;
      const productCAmount = (productAAmount * ratioC) / ratioA;
      result = {
        a: parseInt(productAAmount),
        b: parseInt(productBAmount),
        c: parseInt(productCAmount)
      };
    }
  
    // Generera HTML för resultatet
    let resultHTML = `<h2>Resultat:</h2>
      <table>
        <tr>
          <th>Del</th>
          <th>Mängd</th>
        </tr>
        <tr>
          <td>A-del:</td>
          <td>${result.a}</td>
        </tr>
        <tr>
          <td>B-del:</td>
          <td>${result.b}</td>
        </tr>`;
    if (result.c !== '') {
      resultHTML += `<tr>
          <td>C-del:</td>
          <td>${result.c}</td>
        </tr>`;
    }
    resultHTML += `</table>`;
    
    document.getElementById('result-container').innerHTML = resultHTML;
  });
  