(function () {
  // Create and style hamburger button
  const hamburger = document.createElement('div');
  hamburger.innerHTML = '&#9776;';
  hamburger.style = `
    position: fixed;
    top: 10px;
    right: 10px;
    font-size: 24px;
    z-index: 9999;
    cursor: pointer;
    color: white;
    background: black;
    padding: 4px 10px;
    border-radius: 5px;
  `;

  // Create sidebar container
  const sidebar = document.createElement('div');
  sidebar.style = `
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 250px;
    background-color: #111;
    color: white;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0,0,0,0.5);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 9998;
  `;

  // Toggle sidebar
  hamburger.onclick = () => {
    sidebar.style.transform =
      sidebar.style.transform === 'translateX(0%)'
        ? 'translateX(-100%)'
        : 'translateX(0%)';
  };

    sidebar.addEventListener('mouseleave', () => {
        sidebar.style.transform = 'translateX(-100%)'; // or display = 'none';
    });


  // Sidebar content
  sidebar.innerHTML = `
    <h2>Mogwai</h2>

    <details>
      <summary>Home</summary>
      <ul style="list-style: none; padding-left: 10px;">
        <li><a href="#" style="color:white">Main View</a></li>
        <li><a href="#" style="color:white">Message View</a></li>
      </ul>
    </details>
//// Begin proxy script
    <details open>
      <summary>Config</summary>
      <ul style="list-style: none; padding-left: 10px;">
        <li>
          <label for="nodeURL">Node URL:</label><br>
          <input id="nodeURL" value="http://127.0.0.1:7788/" style="width: 100%;" />
        </li>
        <li style="margin-top: 10px;">
          <button id="downloadPrivateKey" style="width: 100%;">Download Private Key</button>
        </li>
        <li style="margin-top: 10px; font-size: 0.9em;">
          <b>Dependencies:</b>
          <ul style="list-style: disc; margin-left: 20px;">
            <li>digibyted (with RPC enabled)</li>
            <li>Node.js installed</li>
            <li>Local proxy script running</li>
          </ul>
        </li>
      </ul>
    </details>
  `;

  // Download script handler
  sidebar.querySelector('#downloadPrivateKey').onclick = () => {

    console.log(account)
    accountS = JSON.stringify(account)

    const blob = new Blob([accountS], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = account.address + '.json';
    a.click();
  };

// end of download Proxy

  document.body.appendChild(hamburger);
  document.body.appendChild(sidebar);
})();

