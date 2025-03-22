document.addEventListener("DOMContentLoaded", () => {
  const codeLeftInput = document.getElementById("codeLeftInput");
  const codeRightInput = document.getElementById("codeRightInput");
  const resultLeft = document.getElementById("resultLeft");
  const resultRight = document.getElementById("resultRight");
  const compareBtn = document.getElementById("compareBtn");
  const clearLeftBtn = document.getElementById("clearLeft");
  const clearRightBtn = document.getElementById("clearRight");
  const clearResultLeftBtn = document.getElementById("clearResultLeft");
  const clearResultRightBtn = document.getElementById("clearResultRight");
  const copyButtons = document.querySelectorAll(".copy-btn");
  const saveButtons = document.querySelectorAll(".save-btn");
  const mergeHint = document.getElementById("mergeHint");

  // Store original content
  let originalLeftText = codeLeftInput.value;
  let originalRightText = codeRightInput.value;
  let modifiedLeftText = codeLeftInput.value;
  let modifiedRightText = codeRightInput.value;

  // Context Menu creation
  const contextMenu = document.createElement('div');
  contextMenu.id = 'contextMenu';
  contextMenu.style.display = 'none';
  contextMenu.style.position = 'absolute';
  contextMenu.style.zIndex = '1000';
  contextMenu.style.backgroundColor = '#343a40';
  contextMenu.style.border = '1px solid #495057';
  contextMenu.style.borderRadius = '4px';
  contextMenu.style.padding = '5px';
  contextMenu.className = 'context-menu'; // For CSS styling

  const mergeLeftButton = document.createElement('button');
  mergeLeftButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2ecc71" class="bi bi-play-fill bi-play-reverse" viewBox="0 0 16 16"><path d="M4.404 4.308L10.767 8l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-.919 1.233-.696z"/></svg>';
  mergeLeftButton.title = 'Merge Left';
  mergeLeftButton.style.backgroundColor = 'transparent';
  mergeLeftButton.style.border = 'none';
  mergeLeftButton.style.cursor = 'pointer';
  mergeLeftButton.style.padding = '3px';
  mergeLeftButton.className = 'context-menu-button'; // For CSS styling
  contextMenu.appendChild(mergeLeftButton);

  const mergeRightButton = document.createElement('button');
  mergeRightButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2ecc71" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-.919 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>';
  mergeRightButton.title = 'Merge Right';
  mergeRightButton.style.backgroundColor = 'transparent';
  mergeRightButton.style.border = 'none';
  mergeRightButton.style.cursor = 'pointer';
  mergeRightButton.style.padding = '3px';
  mergeRightButton.className = 'context-menu-button'; // For CSS styling
  contextMenu.appendChild(mergeRightButton);

  const updateButton = document.createElement('button');
  updateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#007bff" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/></svg>';
  updateButton.title = 'Update/Replace'; // Fixed typo in your title
  updateButton.style.backgroundColor = 'transparent';
  updateButton.style.border = 'none';
  updateButton.style.cursor = 'pointer';
  updateButton.style.padding = '3px';
  updateButton.className = 'context-menu-button';
  contextMenu.appendChild(updateButton);

  const removeButton = document.createElement('button');
  removeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#dc3545" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
  removeButton.title = 'Remove';
  removeButton.style.backgroundColor = 'transparent';
  removeButton.style.border = 'none';
  removeButton.style.cursor = 'pointer';
  removeButton.style.padding = '3px';
  removeButton.className = 'context-menu-button'; // For CSS styling
  contextMenu.appendChild(removeButton);

  document.body.appendChild(contextMenu);

  // Function to update original content (after compare)
  function updateOriginalContent() {
    originalLeftText = codeLeftInput.value;
    originalRightText = codeRightInput.value;
    modifiedLeftText = codeLeftInput.value;
    modifiedRightText = codeRightInput.value;
  }

  // Add line numbers to top boxes
  function updateLineNumbers(container, textarea) {
    const existingNumbers = container.querySelector(".line-numbers");
    if (existingNumbers) existingNumbers.remove();

    const lines = textarea.value.split("\n");
    const lineNumbers = document.createElement("div");
    lineNumbers.className = "line-numbers";

    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 16;
    const scrollTop = textarea.scrollTop;
    const containerHeight = textarea.clientHeight;
    const firstVisibleLine = Math.floor(scrollTop / lineHeight);
    const visibleLinesCount = Math.ceil(containerHeight / lineHeight);
    const lastVisibleLine = Math.min(firstVisibleLine + visibleLinesCount, lines.length);

    for (let i = firstVisibleLine; i < lastVisibleLine; i++) {
      const num = document.createElement("span");
      num.textContent = i + 1;
      lineNumbers.appendChild(num);
    }

    lineNumbers.style.top = `${10 - scrollTop % lineHeight}px`;
    container.insertBefore(lineNumbers, container.querySelector(".resizable"));
  }

  updateLineNumbers(document.getElementById("leftContainer"), codeLeftInput);
  updateLineNumbers(document.getElementById("rightContainer"), codeRightInput);

  // Clear buttons
  clearLeftBtn.addEventListener("click", () => {
    codeLeftInput.value = "";
    updateLineNumbers(document.getElementById("leftContainer"), codeLeftInput);
    updateOriginalContent(); //Clear
  });

  clearRightBtn.addEventListener("click", () => {
    codeRightInput.value = "";
    updateLineNumbers(document.getElementById("rightContainer"), codeRightInput);
    updateOriginalContent(); //Clear
  });

  clearResultLeftBtn.addEventListener("click", () => {
    resultLeft.innerHTML = "";
  });

  clearResultRightBtn.addEventListener("click", () => {
    resultRight.innerHTML = "";
  });

  // New logic on text cleanup / alignment (top 2 boxes)
  // Trim buttons for removing leading spaces/tabs
  const trimLeftBtn = document.getElementById("trimLeft");
  const trimRightBtn = document.getElementById("trimRight");

  trimLeftBtn.addEventListener("click", () => {
    codeLeftInput.value = codeLeftInput.value.split("\n").map(line => line.replace(/^\s+/, "")).join("\n");
    updateLineNumbers(document.getElementById("leftContainer"), codeLeftInput);
    updateOriginalContent(); // Update stored content
  });

  trimRightBtn.addEventListener("click", () => {
    codeRightInput.value = codeRightInput.value.split("\n").map(line => line.replace(/^\s+/, "")).join("\n");
    updateLineNumbers(document.getElementById("rightContainer"), codeRightInput);
    updateOriginalContent(); // Update stored content
  });

  // Update line numbers on input and scroll
  [codeLeftInput, codeRightInput].forEach((textarea) => {
    textarea.addEventListener("input", () => {
      updateLineNumbers(textarea.closest(".code-container"), textarea);
    });
    textarea.addEventListener("scroll", () => {
      updateLineNumbers(textarea.closest(".code-container"), textarea);
    });
  });

  // Compare button
  compareBtn.addEventListener("click", () => {
    const leftText = codeLeftInput.value;
    const rightText = codeRightInput.value;

    if (!leftText && !rightText) {
      alert("Please enter code in both text areas");
      return;
    }

    updateOriginalContent(); // Store current content
    const diff = computeDiff(leftText, rightText);
    displayDiff(diff, resultLeft, resultRight);

    // Show merge hint
    const mergeHint = document.getElementById("mergeHint");
    mergeHint.style.display = "block";

    // Scroll to the "Original (Differences Highlighted)" section
    document.getElementById("resultLeft").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  // Copy buttons
  copyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      let content = "";
       if (target.id === 'resultLeft' || target.id === 'resultRight') {
          content = Array.from(target.querySelectorAll('.line-content')).map(el => el.textContent).join('\n');
        } else {
          content = target.value;
        }
      navigator.clipboard.writeText(content).then(() => {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>';
        setTimeout(() => {
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/></svg>';
        }, 2000);
      });
    });
  });

  // Save buttons
  saveButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      let content = "";
      if (target.id === 'resultLeft' || target.id === 'resultRight') {
        content = Array.from(target.querySelectorAll('.line-content')).map(el => el.textContent).join('\n');
      } else {
        content = target.value;
      }
      const filename = "diffchecker_content.txt"; // Default filename
      downloadFile(content, filename);
    });
  });

  // Function to trigger file download
  function downloadFile(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  // Compute diff
  function computeDiff(text1, text2) {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const lcsMatrix = computeLCSMatrix(lines1, lines2);
    return backtrack(lines1, lines2, lcsMatrix);
  }

  function computeLCSMatrix(lines1, lines2) {
    const matrix = Array(lines1.length + 1)
      .fill()
      .map(() => Array(lines2.length + 1).fill(0));

    for (let i = 1; i <= lines1.length; i++) {
      for (let j = 1; j <= lines2.length; j++) {
        if (lines1[i - 1] === lines2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        }
      }
    }
    return matrix;
  }

  function backtrack(lines1, lines2, lcsMatrix) {
    const diff = [];
    let i = lines1.length;
    let j = lines2.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
        diff.unshift({ type: "unchanged", line: lines1[i - 1], leftIndex: i - 1, rightIndex: j - 1 });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
        diff.unshift({ type: "added", line: lines2[j - 1], rightIndex: j - 1 });
        j--;
      } else if (i > 0 && (j === 0 || lcsMatrix[i][j - 1] < lcsMatrix[i - 1][j])) {
        diff.unshift({ type: "removed", line: lines1[i - 1], leftIndex: i - 1 });
        i--;
      }
    }
    return diff;
  }

  // Display diff with selection handling
  function displayDiff(diff, leftResult, rightResult) {
    leftResult.innerHTML = "";
    rightResult.innerHTML = "";
    let leftLineNumber = 1;
    let rightLineNumber = 1;

    diff.forEach((item, index) => {
      const lineElement = document.createElement("div");
      lineElement.className = `line ${item.type}`;
      lineElement.dataset.index = index;

      const lineNumberSpan = document.createElement("span");
      lineNumberSpan.className = "line-number";

      const lineContentSpan = document.createElement("span");
      lineContentSpan.className = "line-content";
      lineContentSpan.textContent = item.line;

      if (item.type === "unchanged" || item.type === "removed") {
        lineNumberSpan.textContent = leftLineNumber++;
        const leftLine = lineElement.cloneNode(true);
        leftLine.append(lineNumberSpan.cloneNode(true), lineContentSpan.cloneNode(true));
        leftResult.appendChild(leftLine);
      }

      if (item.type === "unchanged" || item.type === "added") {
        lineNumberSpan.textContent = rightLineNumber++;
        const rightLine = lineElement.cloneNode(true);
        rightLine.append(lineNumberSpan.cloneNode(true), lineContentSpan.cloneNode(true));
        rightResult.appendChild(rightLine);
      }
    });

    // Add double-click selection event listeners
    [leftResult, rightResult].forEach((result, side) => {
      result.addEventListener("dblclick", (e) => {
        const line = e.target.closest(".line");
        if (!line) return;

        // Remove existing selection
        document.querySelectorAll(".line.selected").forEach(el => el.classList.remove("selected"));

        // Add selection highlight
        line.classList.add("selected");
        const index = parseInt(line.dataset.index);
        showMergeButton(line, diff[index], side === 0 ? "left" : "right");
      });

      // Right-click context menu
      result.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const line = e.target.closest('.line');
        if (!line) return;

        // Remove existing selection
        document.querySelectorAll(".line.selected").forEach(el => el.classList.remove("selected"));

        // Add selection highlight
        line.classList.add("selected");
        const index = parseInt(line.dataset.index);
        const diffItem = diff[index]; // Get the diff item

        // Determine which side we are on and show appropriate buttons
        if (side === 0) { // Left side
          mergeLeftButton.style.display = 'none';
          mergeRightButton.style.display = 'inline-block';
        } else { // Right side
          mergeLeftButton.style.display = 'inline-block';
          mergeRightButton.style.display = 'none';
        }

        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.display = 'block';

        // Merge Left action
        mergeLeftButton.onclick = () => {
          mergeLine(diffItem, 'right'); // Merge to the right
          contextMenu.style.display = 'none';
          line.classList.remove("selected");
        };

        // Merge Right action
        mergeRightButton.onclick = () => {
          mergeLine(diffItem, 'left'); // Merge to the left
          contextMenu.style.display = 'none';
          line.classList.remove("selected");
        };

        // Remove action
        removeButton.onclick = () => {
          removeLine(diffItem);
          contextMenu.style.display = 'none';
          line.classList.remove("selected");
        };

        // Update action
        updateButton.style.display = 'inline-block';
        updateButton.onclick = () => {
          updateLine(diffItem, side === 0 ? "right" : "left");
          contextMenu.style.display = 'none';
          line.classList.remove("selected");
        };

        // Close menu when clicking outside
        document.addEventListener('click', function clickOutside(event) {
          if (!contextMenu.contains(event.target)) {
            contextMenu.style.display = 'none';
            line.classList.remove("selected");
            document.removeEventListener('click', clickOutside);
          }
        });
      });
    });
  }

  // Show merge button in the dedicated container
  function showMergeButton(lineElement, diffItem, side) {
    const existingButton = document.querySelector(".merge-btn");
    if (existingButton) existingButton.remove();

    const mergeBtn = document.createElement("button");
    mergeBtn.className = "btn btn-outline-success custom-rounded merge-btn";
    mergeBtn.textContent = side === "left" ? "Merge Selected to Right" : "Merge Selected to Left";

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-outline-danger custom-rounded remove-btn";
    removeBtn.textContent = "Remove Selected Line";
    removeBtn.style.marginLeft = "10px"; /* Adds 10px space to the left of removeBtn */

    const updateBtn = document.createElement("button");
    updateBtn.className = "btn btn-outline-primary custom-rounded update-btn";
    updateBtn.textContent = side === "left" ? "Update Left with Right" : "Update Right with Left";
    updateBtn.style.marginLeft = "10px";

    const mergeContainer = document.getElementById("mergeButtonContainer");
    mergeContainer.innerHTML = "";
    mergeContainer.appendChild(mergeBtn);
    mergeContainer.appendChild(removeBtn);
    mergeContainer.appendChild(updateBtn);

    mergeContainer.scrollIntoView({ behavior: "smooth", block: "center" });

    mergeBtn.addEventListener("click", () => {
      mergeLine(diffItem, side);
      lineElement.classList.remove("selected");
      mergeBtn.remove();
      removeBtn.remove();
      updateBtn.remove();
    });

    removeBtn.addEventListener("click", () => {
      removeLine(diffItem);
      lineElement.classList.remove("selected");
      mergeBtn.remove();
      removeBtn.remove();
      updateBtn.remove();
    });

    updateBtn.addEventListener("click", () => {
      updateLine(diffItem, side);
      lineElement.classList.remove("selected");
      mergeBtn.remove();
      removeBtn.remove();
      updateBtn.remove();
    });

    document.addEventListener("click", (e) => {
      if (!mergeContainer.contains(e.target) && !lineElement.contains(e.target)) {
        lineElement.classList.remove("selected");
        mergeBtn.remove();
        removeBtn.remove();
        updateBtn.remove();
      }
    }, { once: true });
  }

  // Merge selected line at the correct position
  function mergeLine(diffItem, side) {
    // Create copies of the *modified* text
    let newLeftText = modifiedLeftText.split("\n");
    let newRightText = modifiedRightText.split("\n");

    if (side === "left" && diffItem.type === "removed") {
      const insertIndex = diffItem.leftIndex;
      newRightText.splice(insertIndex, 0, diffItem.line);
    } else if (side === "right" && diffItem.type === "added") {
      const insertIndex = diffItem.rightIndex;
      newLeftText.splice(insertIndex, 0, diffItem.line);
    }

    // Join the text and update the *modified* variables
    modifiedLeftText = newLeftText.join("\n");
    modifiedRightText = newRightText.join("\n");

    // Re-display the diff based on the *modified* text
    displayDiff(computeDiff(modifiedLeftText, modifiedRightText), resultLeft, resultRight);
  }

  function removeLine(diffItem) {
    let newLeftText = modifiedLeftText.split("\n");
    let newRightText = modifiedRightText.split("\n");

    if (diffItem.leftIndex !== undefined) {
      newLeftText.splice(diffItem.leftIndex, 1);
    }
    if (diffItem.rightIndex !== undefined) {
      newRightText.splice(diffItem.rightIndex, 1);
    }

    modifiedLeftText = newLeftText.join("\n");
    modifiedRightText = newRightText.join("\n");

    // Re-display the diff based on the *modified* text
    displayDiff(computeDiff(modifiedLeftText, modifiedRightText), resultLeft, resultRight);
  }

  // New update function
  function updateLine(diffItem, side) {
    let newLeftText = modifiedLeftText.split("\n");
    let newRightText = modifiedRightText.split("\n");

    if (side === "left" && diffItem.rightIndex !== undefined) {
      // Update left side with right side content
      const updateIndex = diffItem.rightIndex;
      if (newLeftText[updateIndex] !== undefined) {
        newLeftText[updateIndex] = diffItem.line;
      }
    } else if (side === "right" && diffItem.leftIndex !== undefined) {
      // Update right side with left side content
      const updateIndex = diffItem.leftIndex;
      if (newRightText[updateIndex] !== undefined) {
        newRightText[updateIndex] = diffItem.line;
      }
    }

    modifiedLeftText = newLeftText.join("\n");
    modifiedRightText = newRightText.join("\n");

    displayDiff(computeDiff(modifiedLeftText, modifiedRightText), resultLeft, resultRight);
  }

  // Resizing functionality
  /*
  const resizableContainers = document.querySelectorAll(".resizable");
  resizableContainers.forEach(container => {
    const handle = container.querySelector(".resize-handle");
    let isResizing = false;

    handle.addEventListener("mousedown", (e) => {
      isResizing = true;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      const newHeight = e.clientY - container.getBoundingClientRect().top;
      if (newHeight > 200) {
        container.style.height = `${newHeight}px`;
        resizableContainers.forEach(c => (c.style.height = `${newHeight}px`));
        updateLineNumbers(container, container.querySelector(".code-input"));
      }
    });

    document.addEventListener("mouseup", () => {
      isResizing = false;
    });
  });
  */
  // Resizing functionality
  const resizableContainers = document.querySelectorAll(".resizable");
  resizableContainers.forEach(container => {
    const handle = container.querySelector(".resize-handle");
    let isResizing = false;

    handle.addEventListener("mousedown", (e) => {
      isResizing = true;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      const newHeight = e.clientY - container.getBoundingClientRect().top;
      if (newHeight > 200) {
        container.style.height = `${newHeight}px`;
        resizableContainers.forEach(c => (c.style.height = `${newHeight}px`));
        // Remove the updateLineNumbers call from here
      }
    });

    document.addEventListener("mouseup", () => {
      isResizing = false;
    });
  });

  // Add sample code
  codeLeftInput.value = 'function calculateSum(a, b) {\n  // Add two numbers\n  return a + b;\n}\n\nconst result = calculateSum(5, 10);\nconsole.log("The sum is: " + result);';
  codeRightInput.value = "function calculateSum(a, b) {\n  // Add two numbers together\n  return a + b;\n}\n\n// Calculate the result\nconst result = calculateSum(5, 10);\nconsole.log(`The sum is: ${result}`);";

  originalLeftText = codeLeftInput.value;
  originalRightText = codeRightInput.value;
  modifiedLeftText = codeLeftInput.value;
  modifiedRightText = codeRightInput.value;

  updateLineNumbers(document.getElementById("leftContainer"), codeLeftInput);
  updateLineNumbers(document.getElementById("rightContainer"), codeRightInput);
});

// History Functionality
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

function saveToHistory() {
  const leftInput = codeLeftInput.value;
  const rightInput = codeRightInput.value;
  const leftResult = resultLeft.innerHTML;
  const rightResult = resultRight.innerHTML;
  
  if (!leftInput && !rightInput) return; // Don't save empty comparisons

  const timestamp = new Date().toLocaleString();
  const comparison = {
    timestamp,
    leftInput,
    rightInput,
    leftResult,
    rightResult
  };

  const comparisons = JSON.parse(localStorage.getItem('diffcheckerHistory')) || [];
  comparisons.unshift(comparison); // Add to beginning
  localStorage.setItem('diffcheckerHistory', JSON.stringify(comparisons));
  
  addHistoryItem(comparison, 0);
}

function addHistoryItem(comparison, index) {
  const historyList = document.getElementById('historyList');
  const historyItem = document.createElement('div');
  historyItem.className = 'history-item text-light mb-2 p-2 rounded';
  historyItem.style.cursor = 'pointer';
  historyItem.dataset.index = index;
  
  historyItem.innerHTML = `
    <small>${comparison.timestamp}</small>
  `;
  
  historyItem.addEventListener('click', () => loadComparison(comparison));
  historyList.prepend(historyItem); // Add to top
}

function loadComparison(comparison) {
  codeLeftInput.value = comparison.leftInput;
  codeRightInput.value = comparison.rightInput;
  resultLeft.innerHTML = comparison.leftResult;
  resultRight.innerHTML = comparison.rightResult;
  
  // Update line numbers
  updateLineNumbers(document.getElementById("leftContainer"), codeLeftInput);
  updateLineNumbers(document.getElementById("rightContainer"), codeRightInput);
  
  // Show merge hint if there are results
  mergeHint.style.display = (comparison.leftResult || comparison.rightResult) ? 'block' : 'none';
}

// Initialize history when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeHistory();
});