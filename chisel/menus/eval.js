function makeCodeEditor(target) {
  const container = document.createElement("div");
  container.style.border = "1px solid #444";
  container.style.padding = "10px";
  container.style.margin = "10px 0";
  container.style.background = "#222";
  container.style.color = "#fff";

  // textarea for code
  const textarea = document.createElement("textarea");
  textarea.style.width = "100%";
  textarea.style.height = "150px";
  textarea.style.fontFamily = "monospace";
  textarea.style.fontSize = "14px";
  textarea.style.marginBottom = "8px";
  textarea.id = "evalTextArea";

  // label
  const oprLabel = document.createElement("label");
  oprLabel.innerText = "Memo: ";
  oprLabel.style.marginRight = "8px"; // space between label and input

  // opRet box
  const opRetInput = document.createElement("input");
  opRetInput.id = "opRetInput";
  opRetInput.type = "text";
  opRetInput.placeholder = "Text and emoticons OK here";
  opRetInput.style.width = "80%";


  // filename box
  const filenameInput = document.createElement("input");
  filenameInput.type = "text";
  filenameInput.placeholder = "filename.js";
  filenameInput.style.marginRight = "8px";


  // result box
  const resultBox = document.createElement("div");
  resultBox.id = "resultBox";
  resultBox.style.border = "1px solid #444";
  resultBox.style.padding = "10px";
  resultBox.style.margin = "10px 0";
  resultBox.style.background = "#222";
  resultBox.style.color = "#fff";


  // run button
  const runButton = document.createElement("button");
  runButton.textContent = "Run";
  runButton.id = "runButton";
  runButton.onclick = () => {
    const code = textarea.value;
    try {
      eval(code);
    } catch (e) {
      console.error("Error in eval:", e);
      alert("Eval error: " + e.message);
    }
  };

  // save button
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.onclick = () => {
    const code = textarea.value;
    const filename = filenameInput.value.trim() || "snippet.js";

    const blob = new Blob([code], { type: "text/javascript" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  // assemble UI
  container.appendChild(textarea);
  container.appendChild(document.createElement("br"));
  container.appendChild(oprLabel);
  container.appendChild(opRetInput);
  container.appendChild(resultBox);
  container.appendChild(filenameInput);
  container.appendChild(runButton);
  container.appendChild(saveButton);

  target.appendChild(container);
}

