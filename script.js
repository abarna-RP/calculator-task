document.addEventListener('DOMContentLoaded', () => {
    const entryForm = document.getElementById('entry-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInput = document.getElementById('type');
    const entryList = document.getElementById('entry-list');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');
    const netBalance = document.getElementById('net-balance');
    const resetBtn = document.getElementById('reset-btn');
    const filters = document.querySelectorAll('input[name="filter"]');
  
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
  
    // Render entries
    const renderEntries = (filter = 'all') => {
      entryList.innerHTML = '';
      let totalInc = 0;
      let totalExp = 0;
  
      entries
        .filter(entry => filter === 'all' || entry.type === filter)
        .forEach((entry, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${entry.description}: $${entry.amount} (${entry.type})</span>
            <div>
              <button class="edit" onclick="editEntry(${index})">Edit</button>
              <button class="delete" onclick="deleteEntry(${index})">Delete</button>
            </div>
          `;
          entryList.appendChild(li);
  
          if (entry.type === 'income') totalInc += parseFloat(entry.amount);
          else totalExp += parseFloat(entry.amount);
        });
  
      totalIncome.textContent = `$${totalInc.toFixed(2)}`;
      totalExpense.textContent = `$${totalExp.toFixed(2)}`;
      netBalance.textContent = `$${(totalInc - totalExp).toFixed(2)}`;
    };
  
    // Add entry
    entryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = descriptionInput.value.trim();
      const amount = parseFloat(amountInput.value.trim());
      const type = typeInput.value;
  
      if (description && amount) {
        entries.push({ description, amount, type });
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
        entryForm.reset();
      }
    });
  
    // Edit entry
    window.editEntry = (index) => {
      const entry = entries[index];
      descriptionInput.value = entry.description;
      amountInput.value = entry.amount;
      typeInput.value = entry.type;
  
      entries.splice(index, 1);
      localStorage.setItem('entries', JSON.stringify(entries));
      renderEntries();
    };
  
    // Delete entry
    window.deleteEntry = (index) => {
      entries.splice(index, 1);
      localStorage.setItem('entries', JSON.stringify(entries));
      renderEntries();
    };
  
    // Reset form
    resetBtn.addEventListener('click', () => {
      entryForm.reset();
    });
  
    // Filter entries
    filters.forEach(filter => {
      filter.addEventListener('change', () => {
        renderEntries(filter.value);
      });
    });
  
    // Initial render
    renderEntries();
  });