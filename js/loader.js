(function(){
  // Ensure loader stays until window load
  function hideLoader() {
    document.body.classList.add('loaded');
    // remove from DOM after transition to keep markup clean
    setTimeout(function(){
      var el = document.getElementById('page-loader');
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 700);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    // Optional: fallback to remove after 8s in case load never fires
    setTimeout(function(){ if (!document.body.classList.contains('loaded')) hideLoader(); }, 8000);
  }
})();
