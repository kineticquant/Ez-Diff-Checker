document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('historySidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');
  
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('sidebar-active');
    });
  
    // Close sidebar when clicking outside on mobile - bug fix 3.25.25
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('sidebar-active');
      }
    });
  });