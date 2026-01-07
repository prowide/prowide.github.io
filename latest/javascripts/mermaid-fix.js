// Mermaid initialization fix for Material for MkDocs instant loading + encryptcontent
// This ensures Mermaid diagrams are rendered after content is decrypted

function initializeMermaid() {
  // Find all pre>code blocks with mermaid class and convert them to div.mermaid
  const mermaidBlocks = document.querySelectorAll('pre > code.language-mermaid');

  mermaidBlocks.forEach(function(block) {
    const pre = block.parentElement;
    const code = block.textContent;

    // Create a new div element for mermaid
    const div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = code;

    // Replace the pre element with the div
    pre.replaceWith(div);
  });

  // Initialize mermaid if it's loaded
  if (typeof mermaid !== 'undefined') {
    try {
      mermaid.contentLoaded();
    } catch (e) {
      // Fallback for older mermaid versions
      try {
        mermaid.init(undefined, '.mermaid');
      } catch (e2) {
        console.error('Failed to initialize Mermaid:', e2);
      }
    }
  }
}

// Hook into instant loading navigation
if (typeof document$ !== 'undefined') {
  document$.subscribe(function() {
    // Wait a bit for content to be decrypted before initializing Mermaid
    setTimeout(initializeMermaid, 100);
  });
}

// Also hook into the encryptcontent plugin's decrypt event
// The plugin triggers a custom event or mutation when content is decrypted
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    // Check if encrypted content div became visible
    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
      const target = mutation.target;
      if (target.id === 'mkdocs-decrypted-content' || target.classList.contains('md-content')) {
        initializeMermaid();
      }
    }
    // Check if new nodes with mermaid code were added
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1 && (node.querySelector && node.querySelector('code.language-mermaid'))) {
          initializeMermaid();
        }
      });
    }
  });
});

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['style']
});
