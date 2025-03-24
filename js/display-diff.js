// Modified displayDiff function with corrected character-level highlighting
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
  
      // Handle character-level diff for added/removed lines
      if (item.type === "unchanged") {
        lineContentSpan.textContent = item.line;
      } else {
        // For added or removed lines, compare with the corresponding line if available
        let comparisonLine = "";
        let charDiffResult = null;
  
        if (item.type === "removed" && diff[index + 1]?.type === "added") {
          comparisonLine = diff[index + 1].line;
          charDiffResult = highlightCharDiff(item.line, comparisonLine);
        } else if (item.type === "added" && diff[index - 1]?.type === "removed") {
          comparisonLine = diff[index - 1].line;
          charDiffResult = highlightCharDiff(comparisonLine, item.line);
        }
  
        if (charDiffResult) {
          // Use the appropriate result for each side
          if (item.type === "removed") {
            lineContentSpan.innerHTML = charDiffResult.left; // Original text with highlights
          } else if (item.type === "added") {
            lineContentSpan.innerHTML = charDiffResult.right; // Modified text with highlights
          }
        } else {
          lineContentSpan.textContent = item.line; // Fallback if no comparison line
        }
      }
  
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
  
    // Existing event listeners remain unchanged
    [leftResult, rightResult].forEach((result, side) => {
      result.addEventListener("dblclick", (e) => {
        const line = e.target.closest(".line");
        if (!line) return;
  
        document.querySelectorAll(".line.selected").forEach(el => el.classList.remove("selected"));
        line.classList.add("selected");
        const index = parseInt(line.dataset.index);
        showMergeButton(line, diff[index], side === 0 ? "left" : "right");
      });
  
      result.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const line = e.target.closest('.line');
        if (!line) return;
  
        document.querySelectorAll(".line.selected").forEach(el => el.classList.remove("selected"));
        line.classList.add("selected");
        const index = parseInt(line.dataset.index);
        const diffItem = diff[index];
  
        if (side === 0) {
          mergeLeftButton.style.display = 'none';
          mergeRightButton.style.display = 'inline-block';
        } else {
          mergeLeftButton.style.display = 'inline-block';
          mergeRightButton.style.display = 'none';
        }
  
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.display = 'block';
  
        mergeLeftButton.onclick = () => {
          mergeLine(diffItem, 'right');
          contextMenu.style.display = 'none';
          line.classList.remove("selected");
        };
  
        mergeRightButton.onclick = () => {
          mergeLine(diffItem, 'left');
          contextMenu.style.display = 'none';
          line.classList.remove("selected");
        };
  
        removeButton.onclick = () => {
          removeLine(diffItem);
          contextMenu.style.display = 'none';
          line.classList.remove("selected");
        };
  
        updateButton.style.display = 'inline-block';
        updateButton.onclick = () => {
          updateLine(diffItem, side === 0 ? "right" : "left");
          contextMenu.style.display = 'none';
          line.classList.remove("selected");
        };
  
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