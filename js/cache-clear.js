document.addEventListener("DOMContentLoaded", () => {
    const confirmClearHistoryBtn = document.getElementById('confirmClearHistory');
    const historyList = document.getElementById('historyList');
    const clearHistoryModalEl = document.getElementById('clearHistoryModal');
    
    // Initialize modal without fade class to test basic functionality
    const clearHistoryModal = new bootstrap.Modal(clearHistoryModalEl, {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    // Ensure modal is fully opaque and clickable when shown
    clearHistoryModalEl.addEventListener('show.bs.modal', () => {
        clearHistoryModalEl.style.opacity = '1';
        clearHistoryModalEl.style.pointerEvents = 'auto';
        document.querySelector('.modal-backdrop').style.opacity = '0.5';
    });

    // Handle the confirmation
    confirmClearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('diffcheckerHistory');
        historyList.innerHTML = '';
        clearHistoryModal.hide();
    });

    // Cleanup on hide
    clearHistoryModalEl.addEventListener('hidden.bs.modal', () => {
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        clearHistoryModalEl.style.opacity = '';
        clearHistoryModalEl.style.pointerEvents = '';
    });
});