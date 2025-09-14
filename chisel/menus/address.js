
canvases = []
tablets = []
tabs = []
canvi = []
colorMap0 = []

async function loadAll(b57file = "b57.json") {
      await Promise.all([
        fetch(b57file).then(res => res.json()).then(data => {
          data.forEach(entry => {
            const rgbArray = entry.rgb.split(',').map(v => parseInt(v.trim(), 10));
            colorMap0[entry.b57] = rgbArray;
          });
        })
      ]);
    }

loadAll();

mainMenu.items.address.pagePrev = function() {

 mainMenu.items.address.page -= 1;
 loadAddressData(dgb.searchAddress,dgb.prev)
 }

mainMenu.items.address.pageNext = function() {

   dgb.prev = dgb.txsCache[0].txid
   mainMenu.items.address.page += 1;

   if(dgb.txsCache.length == 25)
      loadAddressData(dgb.searchAddress,dgb.txsCache[24].txid)
}


async function loadAddressData( address, chain = "" ) {


    dgb.searchAddress = address

    var url = "";

    if(chain == "") {
    url = `https://digiexplorer.info/api/address/${address}/txs`;
    }
    else
    {
    url = `https://digiexplorer.info/api/address/${address}/txs/chain/${chain}`;
    console.log("adfsafsfd",dgb.txsCache.length)
    }

    
    const container = document.getElementById("section-address"); // replace with actual div id
    container.innerHTML = "Loading...";

    try {
        const res = await fetch(url);
        const txs = await res.json();
        dgb.txsCache = txs;

        // Find account amount (sum of UTXOs to address - spent)
        const balance = txs.reduce((bal, tx) => {
        //    c(tx.status.block_height)
            tx.vout.forEach(v => {
                if (v.scriptpubkey_address === address) {
                    bal += v.value;
                }
            });
            tx.vin.forEach(v => {
                if (v.prevout && v.prevout.scriptpubkey_address === address) {
                    bal -= v.prevout.value;
                }
            });
            return bal;
        }, 0);

        let html = `<div id="addressWidget"></div>
                    <pre id="results"></pre>
                    <div>Balance: ${balance / 1e8} DGB</div>`;
        html += `<table border="1" cellspacing="0" cellpadding="4">
                    <tr>
                        <th></th>
                        <th>Block</th>
                        <th>Date</th>
                        <th>OP_RETURN (ASCII)</th>
                    </tr>`;


        txs.forEach((tx, idx) => {
            const block = tx.status.block_height;
            const date = new Date(tx.status.block_time * 1000).toLocaleString();

            // Find OP_RETURN in vout
            let opReturnAscii = "";
            tx.vout.forEach(v => {
                if (v.scriptpubkey_type == "op_return") {
                
                    const hex = v.scriptpubkey_asm.split(" ")[2] || "";
                    opReturnAscii = dgb.opr(hex)
                }
            });
    
            html += `<tr>

                        <td>
                          <button onclick="toggleDetails(${idx}, this)" style="background:white;border:none;cursor:pointer;">
                            <svg width="12" height="12" viewBox="0 0 12 12">
                                <line x1="1" y1="6" x2="11" y2="6" stroke="black" stroke-width="2"/>
                                <line x1="6" y1="1" x2="6" y2="11" stroke="black" stroke-width="2"/>
                            </svg>
                          </button>
                        </td>

                        <td>${block}</td>
                        <td>${date}</td>
                        <td>${opReturnAscii || ""}</td>
                    </tr>
                    <tr id="details-${idx}" style="display:none;">
                        <td colspan="5">

                    <div>
                       <button onclick="setDetailsView(${idx}, 'info')">Info</button>
                       <button onclick="setDetailsView(${idx}, 'raw')">Raw</button>
                       <div id="details-content-${idx}">

                           ${renderInfoView(tx)};
                         </div>
                       </div>

                      </td>
                    </tr>`;
        });

        html += `</table>`;


       // render the "next" link
      container.innerHTML = `<h2>${address}</h2>${html}`;

    if(mainMenu.items.address.page > 0)
      {
      container.innerHTML += `<button id="prev-link-button">[prev]</button>`;

      prevLinkButton = document.getElementById("prev-link-button");
      prevLinkButton.addEventListener("click", function (e) {
          e.preventDefault();
          mainMenu.items.address.pagePrev()
       //   loadAddressData(address, nextId);
      });
      }


      container.innerHTML += `<button id="next-link-button">[next]</button>`;

      const nextLinkButton = document.getElementById("next-link-button");
      nextLinkButton.addEventListener("click", function (e) {
          e.preventDefault();
          mainMenu.items.address.pageNext()
       //   loadAddressData(address, nextId);
      });

new AddressCombo("#addressWidget", {
    addresses: [
      "DDDDDDDDDDDDDDDDDDDDDDDDDDDD5SVJPi",
      "DHooQkHNjos8X15qczAsA3s5cJEMGksdvj",
      "DBxYoUTUBEvCoMzzzzzzzzzzzzzzZ31xMU",
      "DBxYoUTUBEhCoMzzzzzzzzzzzzzzZkL3DC",
      "DBxVoCARoovCoMzzzzzzzzzzzzzzXL8bKa",
      "DBxVoCARoohCoMzzzzzzzzzzzzzzaAvVjE",
      "DATUGu64TCU4qD7vDC5hUYmyfRmEJcGM3J",
      "D6yKrBS6rrUD2Sp2G5TMPdTUY4pkMHGA6T",
      "DDbCsz8VeztP7AwmrWgNADAV58mWpDjqbw",
      "dgb1q4rdplx7k92y4llzq6v6qf9mgpr5zey2js49xzs",
      "DThvAmDxnSya4qnMzmmV2fCK8uCcYrHGFM",
      "DBx4CHANzzzzzzzzzzzzzzzzzzzzb1m2Ef",
      "DAzrL96Z61gP8FtXf1tyw5PteJfQs3fEb1",
      "DAxJoHNxRiGLERzzzzzzzzzzzzzzVKx51Q",
      "DA3GGGgkuAqYTo2fxFzygwQ9ZNzkRuy6tF",
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
        loadAddressData(addr)
        mainMenu.items.address.page = 0;
      document.getElementById("results").innerHTML =
        "<h1>" + addr + "</h1>";
    }
  });


canvi.forEach( x =>  {
 canvas = document.getElementById(`canvas-${x}`)
 chisel.drawCharTabletImage(tabs.shift(),canvas);
})

/*
for (let i = 0; i < canvi.length; i++) {
  const canvas = document.getElementById(`canvas-${canvi[i]}`);
  chisel.drawCharTabletImage(tabs[i], canvas);
}
*/




    } catch (e) {
        container.innerHTML = "Error loading data";
        console.error(e);
    }
}

function renderInfoView(tx) {
    let html = "<strong>Inputs:</strong><br>";
    tx.vin.forEach(v => {
        if (v.prevout) {
            html += `${v.prevout.scriptpubkey_address || "unknown"}: ${v.prevout.value / 1e8} DGB<br>`;
        }
    });
    html += "<br><strong>Outputs:</strong><br>";
    html2 = ""

    tablet = []
   
    needCanvas = 0; 
    tx.vout.forEach(v => {
        value = v.value / 1e8;
        if(value == 0.0000546 && v.scriptpubkey_address.substr(0,2)=="SN" ) 
         {
          needCanvas = 1;
          tablet.push(v.scriptpubkey_address);
         }
        else
          html2 += `${v.scriptpubkey_address || "unknown"}: ${v.value / 1e8} DGB<br>`;
    });
    if(needCanvas)
         {
    
    tabs.push(tablet);
    canvi.push(tx.txid);
    html += `<canvas id=${"canvas-" + tx.txid}></canvas><br>`;
         }
    return "<pre>" + html + "</pre><hr>" + "<pre>" + html2 + "</pre>";
}

////////////////////////

function setDetailsView(idx, mode) {
  const tx = dgb.txsCache[idx];
  const container = document.getElementById(`details-content-${idx}`);

  if (mode === "info") {
    container.innerHTML = renderInfoView(tx);

    // redraw if this tx had a canvas
    const cIndex = canvi.indexOf(tx.txid);
    if (cIndex !== -1) {
      const canvas = document.getElementById(`canvas-${tx.txid}`);
      chisel.drawCharTabletImage(tabs[cIndex], canvas);
    }
  } else {
    container.innerHTML =
      `<pre>${JSON.stringify({ vin: tx.vin, vout: tx.vout }, null, 2)}</pre>`;
  }
}

////////////////////////

function toggleDetails(idx, btn) {
    const el = document.getElementById(`details-${idx}`);
    const isHidden = el.style.display === "none";

    el.style.display = isHidden ? "table-row" : "none";

    // Swap icon
    btn.innerHTML = isHidden
        ? `<svg width="12" height="12" viewBox="0 0 12 12">
               <line x1="1" y1="6" x2="11" y2="6" stroke="black" stroke-width="2"/>
           </svg>`
        : `<svg width="12" height="12" viewBox="0 0 12 12">
               <line x1="1" y1="6" x2="11" y2="6" stroke="black" stroke-width="2"/>
               <line x1="6" y1="1" x2="6" y2="11" stroke="black" stroke-width="2"/>
           </svg>`;
}


function hexToAscii(hex) {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}
