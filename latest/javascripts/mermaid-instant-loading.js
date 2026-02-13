// Fix for Mermaid diagrams with instant loading
// Reinitialize Mermaid after instant navigation
document$.subscribe(function() {
  // Wait for mermaid to be loaded
  if (typeof mermaid !== 'undefined') {
    // Reinitialize all mermaid diagrams on the page
    mermaid.init(undefined, document.querySelectorAll('.mermaid'));
  }
});
