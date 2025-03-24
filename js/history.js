// History Functionality - Ascending
/*
function initializeHistory() {
  const historyList = document.getElementById('historyList');
  const comparisons = JSON.parse(localStorage.getItem('diffcheckerHistory')) || [];
  
  // Display existing history
  comparisons.forEach((comp, index) => {
    addHistoryItem(comp, index);
  });

  // Add event listener to Compare button for history
  compareBtn.addEventListener('click', saveToHistory);
}
*/

// History Functionality - Descending
function initializeHistory() {
    const historyList = document.getElementById('historyList');
    const comparisons = JSON.parse(localStorage.getItem('diffcheckerHistory')) || [];
    
    // Display existing history in descending order (newest at the bottom)
    comparisons.forEach((comp, index) => {
      addHistoryItem(comp, index);
    });
  
    // Add event listener to Compare button for history
    compareBtn.addEventListener('click', saveToHistory);
  }