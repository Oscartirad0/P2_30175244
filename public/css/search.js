document.getElementById('searchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('#enviosTable tbody tr');
  
    rows.forEach(row => {
      const nombre = row.cells[0].textContent.toLowerCase();
      const email = row.cells[1].textContent.toLowerCase();
  
      if (nombre.includes(searchValue) || email.includes(searchValue)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });