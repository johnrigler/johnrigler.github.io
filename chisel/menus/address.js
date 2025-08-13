async function loadAddressData( address ) {
    const url = `https://digiexplorer.info/api/address/${address}/txs`;
    const container = document.getElementById("section-address"); // replace with actual div id
    container.innerHTML = "Loading...";

    try {
        const res = await fetch(url);
        const txs = await res.json();
        dgb.txsCache = txs;

        // Find account amount (sum of UTXOs to address - spent)
        const balance = txs.reduce((bal, tx) => {
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

        let html = `<div>Balance: ${balance / 1e8} DGB</div>`;
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
                if (v.scriptpubkey_asm && v.scriptpubkey_asm.startsWith("OP_RETURN")) {
                    const hex = v.scriptpubkey_asm.split(" ")[1] || "";
                    opReturnAscii = hexToAscii(hex);
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
        container.innerHTML = html;

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
    tx.vout.forEach(v => {
        html += `${v.scriptpubkey_address || "unknown"}: ${v.value / 1e8} DGB<br>`;
    });
    return "<pre>" + html + "</pre>";
}

function setDetailsView(idx, mode) {
    const tx = dgb.txsCache[idx]; // We'll store tx data for reuse
    const container = document.getElementById(`details-content-${idx}`);
    if (mode === "info") {
        container.innerHTML = renderInfoView(tx);
    } else {
        container.innerHTML = `<pre>${JSON.stringify({vin: tx.vin, vout: tx.vout}, null, 2)}</pre>`;
    }
}

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
