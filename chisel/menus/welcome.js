window.chiselMenu[idx("welcome")].html = `
      <section style="padding: 1em; font-family: sans-serif; line-height: 1.6;">
        <h1 style="margin-top: 0;">Welcome to Mogwai / Chisel</h1>
        <p><strong>Chisel</strong> is a lightweight interface for inscribing human-readable data directly onto the <strong>Digibyte</strong> blockchain.</p>

        <p>This tool is designed for both newcomers and experienced users of Bitcoin-style ledgers. You can use it:</p>
        <ul>
          <li>Right here on this site (GitHub Pages)</li>
          <li>From a local folder</li>
          <li>From IPFS (fully decentralized)</li>
        </ul>

        <p>No account is needed. No backend is required. You work entirely in the browser—by default, using public APIs.</p>

        <h2>Optional Power Tools</h2>
        <p>For deeper integration and permanence, you can connect Chisel to your own node:</p>
        <ul>
          <li><strong>digibyted</strong> – allows Chisel to query and broadcast directly to the chain without public APIs</li>
          <li><strong>Node.js + Proxy Script</strong> – needed to bridge your local digibyted node to the browser</li>
          <li><strong>Advanced File Options</strong> - the proxy script doubles as a nodejs local file api</li>
        </ul>

        <p>You can generate this proxy script from the Config section in the hamburger menu.</p>

        <h2>What You Can Do Here</h2>
        <ul>
          <li>Compose MacDougall-style text inscriptions</li>
          <li>Draw or import PNGs to encode visually</li>
          <li>Build and sign transactions</li>
          <li>Save or reload entire project state</li>
        </ul>

        <p>Everything is portable, readable, and built to survive.</p>

        <p style="margin-top: 2em; font-style: italic; color: #666;">
          Chisel is part of the <strong>Mogwai</strong> toolkit, which aims to give everyday people the power to write directly into the permanent public record.
        </p>
      </section>
    `;
