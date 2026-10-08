# John Rigler

## Small tools for things that should belong to the user

My projects keep circling one idea: identity, records, publication, software, and physical artifacts can be built so that the user holds the important state and the surrounding services remain replaceable.

I am interested in systems that can survive the application that created them. A browser page should be able to work without a permanent application server. A public record should remain inspectable outside the product that wrote it. A paper object should be able to point back into a digital system. Identity should not have to begin with somebody else's account database.

```text
human
  ↓
physical or digital artifact
  ↓
small inspectable representation
  ↓
signed / hashed / publicly addressable record
  ↓
replaceable readers, relays and services
```

Blockchains, QR codes, static HTML, filesystems, IPFS, ordinary paper, shell tools, and cryptographic signatures are useful here because they are primitives. The interesting part is how they compose.

## Active projects

- **[Chisel](https://github.com/johnrigler/chisel)** — browser-first tools for reading, constructing, signing, and preserving small UTXO ledger artifacts.
- **[Mogwai](https://github.com/johnrigler/mogwai)** — a user-controlled frame for resolving and navigating media, records, and identity.
- **[Dark Star](https://github.com/johnrigler/darkStar)** — an executable printed publication that treats paper as boot media.
- **[SB Shell](https://github.com/johnrigler/sbshell)** — a revived filesystem-as-publishing system where files remain the source of truth.
- **[Lantern / Zarkmid](https://github.com/johnrigler/zarkmid)** — an older interactive-fiction experiment being revived around portable saves and ledger-backed persistence.
- **CertLedger** — an active private working project exploring cryptographic document identity, QR-labeled paper records, reproducible provenance, and public-ledger references for evidence preservation.

## Why these old projects are moving again

Some of these repositories began years apart and then stalled for ordinary reasons: integration work was tedious, documentation lagged behind the code, and the cost of returning to an old idea could exceed the cost of starting a new one.

Large language models change that equation for me. They make it practical to reopen dormant systems, reconstruct their intent, refactor them incrementally, connect them to newer work, and keep documentation close to implementation.

The result is less a collection of abandoned prototypes and more a long-running body of work becoming legible to itself.

## Working principles

Prefer small primitives over permanent platforms.

Prefer user-held identity over account databases.

Prefer static artifacts that can be copied, inspected, and reconstructed.

Prefer ordinary browser technology when it is sufficient.

Prefer systems whose meaning survives the disappearance of the original service.

The projects are intentionally uneven. Some are tools, some are books, some are experiments, some are archaeological digs into my own older code. They are becoming useful together because they are increasingly speaking the same language.

Browser homepage: https://johnrigler.github.io/
