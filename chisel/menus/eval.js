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

  //control box
  const controlBox = document.createElement("div");
  controlBox.id = "controlBox";
  controlBox.style.border = "1px solid #444";
  controlBox.style.padding = "10px";
  controlBox.style.margin = "10px 0";
  controlBox.style.background = "#222";
  controlBox.style.color = "#fff";

  // run button
  const runButton = document.createElement("button");
  runButton.textContent = "Run";
  runButton.id = "runButton";
  runButton.onclick = () => {
    const code = textarea.value 

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
  container.appendChild(controlBox);
  controlBox.appendChild(filenameInput);
  controlBox.appendChild(runButton);
  controlBox.appendChild(saveButton);

  target.appendChild(container);



evalPopup = function evalPopup(vout = [] , fee = 100){
  
dgb.util.digiAddress(account.address).then( vin =>
   {
   openMultiSelectPopup(vin.map( (x,y) => y + ": " + x.value )).then( result => {
    idx = result.map( x => parseInt(x.split(":")[0]) ); 
    utxo = chisel.pruneByIndexes(vin,idx);
    var change = 0;
    utxo.map( x => change += x.value )
       c(change,utxo)
       change -= utxo.length*fee
       change -= fee
       vout = []
      vout.push({ [vin[0].address]: change / 100000000 })
      rt = dgb.buildRaw( [utxo, vout] )
      pk = dgb.util.pkh(account.privKeyWif)
      srt=dgb.util.signRawTransaction(rt, [pk])
      dgb.sendTx(srt);
      c(rt,srt) 
     })
   })
}

evalPopup = function evalPopup(vout = [] , fee = 100){
  
dgb.util.digiAddress(account.address).then( vin =>
   {
   openMultiSelectPopup(vin.map( (x,y) => y + ": " + x.value )).then( result => {
    idx = result.map( x => parseInt(x.split(":")[0]) );
    utxo = chisel.pruneByIndexes(vin,idx);
    var change = 0;
    utxo.map( x => change += x.value )
       c(change,utxo)
       change -= utxo.length*fee
       change -= fee
       change -= vout.length * fee
     //  vout = []
      vout.push({ [vin[0].address]: change / 100000000 })
       c(change)
      rt = dgb.buildRaw( [utxo, vout] )
      pk = dgb.util.pkh(account.privKeyWif)
      srt=dgb.util.signRawTransaction(rt, [pk])
      dgb.sendTx(srt);
    //  c(rt,srt)
     })
   })
} 

// sendToTablet()
// Tablet.lines.push({"data":asciiToHex("https://wordsworth-editions.com/the-pleasures-of-james-joyce/")})


evalPopup = async function evalPopup(vout = [], rate = 1) {   // rate = sat/byte
  const vin = await dgb.util.digiAddress(account.address);

  const choice = await openMultiSelectPopup(
    vin.map((x, i) => `${i}: ${x.value}`)
  );
  if (!choice) return;

  const idx  = choice.map(x => parseInt(x.split(':')[0]));
  const utxo = chisel.pruneByIndexes(vin, idx);

  let change = utxo.reduce((sum, x) => sum + x.value, 0);

  // rough size: 10 + (148 * #inputs) + (34 * #outputs)
  const size = 10 + 148 * utxo.length + 34 * (vout.length + 1);
  const fee  = size * rate;

  change -= fee;
  vout.push({ [vin[0].address]: change / 1e8 });

  const rt  = dgb.buildRaw([utxo, vout]);
  const pk  = dgb.util.pkh(account.privKeyWif);
  const srt = dgb.util.signRawTransaction(rt, [pk]);
  await dgb.sendTx(srt);

  return {fee, size, vout};
}


}
