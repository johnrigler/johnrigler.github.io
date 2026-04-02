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

  // Index Div
  const indexDiv = document.createElement("div");
  indexDiv.id = "indexDiv";

  // Index label
  const indexLabel = document.createElement("label");
  indexLabel.innerText = "Index: ";
  indexLabel.style.marginRight = "8px"; // space between label and input

  // indexBox
  const indexBox = document.createElement("input");
  indexBox.id = "indexBox";
  indexBox.type = "text";
  indexBox.value = dgb.anchor
  indexBox.style.width = "80%";

  // ipfs label
  const ipfsLabel = document.createElement("label");
  ipfsLabel.innerText = "IPFS ";
  ipfsLabel.style.marginRight = "8px"; // space between label and input

  // ipfs box
  const ipfsInput = document.createElement("input");
  ipfsInput.id = "ipfsInput";
  ipfsInput.type = "text";
  ipfsInput.placeholder = "CIDv0 only";
  ipfsInput.style.width = "80%";

// validate IPFS CIDv0
function isValidCIDv0(cid) {
  // CIDv0 = Qm + 44 base58 chars (total 46)
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cid);
}

// function to run when valid
function onValidCID(cid) {
  console.log("Valid CID:", cid);
  // your logic here
}

// event listener
ipfsInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();
  if (isValidCIDv0(value)) {
    onValidCID(value);
  }
});

  // opRet label
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

  const fpMenuButton = document.createElement("button");
  fpMenuButton.textContent = "FP Menu"; 
  fpMenuButton.onclick = () => {
   fileProxy.read("menu.js")
      .then(x => x.text())
      .then(x => { mainMenu.items.eval.menu = x })

};


  const fpSaveButton = document.createElement("button");
  fpSaveButton.textContent = "FP Save";
  fpSaveButton.onclick = () => {
   fpSaveButton.write(filenameInput.value.trim() || "snippet.js",textarea.value);

 };


  // assemble UI
  container.appendChild(textarea);
  container.appendChild(document.createElement("br"));
  indexDiv.appendChild(indexLabel);
  indexDiv.appendChild(indexBox);
  container.appendChild(indexDiv);
  container.appendChild(document.createElement("br"));
  container.appendChild(ipfsLabel);
  container.appendChild(ipfsInput);
  container.appendChild(document.createElement("br"));
  container.appendChild(oprLabel);
  container.appendChild(opRetInput);
  container.appendChild(resultBox);
  container.appendChild(controlBox);
  controlBox.appendChild(filenameInput);
  controlBox.appendChild(runButton);
  controlBox.appendChild(saveButton);
  controlBox.appendChild(fpMenuButton);
  controlBox.appendChild(fpSaveButton);

  target.appendChild(container);

//////////////

// usage example 1: IPFS CIDv0
createInput(sectionEval,"IPFS (CIDv0)",
  cid => /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cid),
  cid => { 
         cid0 = unspendable("DDx" + cid.substr(0,23))
         cid1 = unspendable("DEx" + cid.substr(23))
         Tablet.ipfs = [ cid0 , cid1 ] 
         console.log("CIDv0 valid:", Tablet.ipfs)
          }
);

// usage example 2: numeric only
createInput(sectionEval,"number",
  val => /^\d+$/.test(val),
  val => console.log("Number valid:", val)
);

//////////////

// #controlBox
new AddressCombo("#indexDiv", {
    addresses: [
      "DDDDDDDDDDDDDDDDDDDDDDDDDDDD5SVJPi",
      "DDeskxHKkHxc3J9g98ZtEvkots3r19u3gp",
      "DNameFhf7r14n7PDAraSVGY1ew7YjDnWNF",
      "DRnHQ1TXd5YdsJM982zXrT1ZZbQk4YFNP6",
      "DQZbkXxdQXqaW8ruhdJx9jv8sJMPwBgfPi",
      "DDiazJpWifSWsWMG3t8SAAKkYTJRFZJ2uj",
      "DNMrYTWkSvBx2tvAhPRsWiDhauasBYGrwV",
      "DDigiU3XBpMD4XaiXK9ymYagtrjz73RZ4r",
      "DJENMFWXGccx2jsjzJPWfprSzbA4xT7wbp"
    ],
    onSearch: function(addr) {
        c(addr)
        indexBox.value=addr
    //    loadAddressData(addr)
   //     mainMenu.items.address.page = 0;
   //   document.getElementById("results").innerHTML =
   //     "<h1>" + addr + "</h1>";
    }
  });


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
