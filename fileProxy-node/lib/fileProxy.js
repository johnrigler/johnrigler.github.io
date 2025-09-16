fileProxy = [];
window.fileProxy = window.fileProxy || {};
fileProxy.server = "localhost"

fileProxy.write = async function fileWrite(data,file) {
    if(typeof(data) == 'object')
    {
    var _data = JSON.stringify(data)
    type = "application/json";
    }
    else
    {
    var _data = data;
    type = "text/plain";
    }
    await fetch(`http://${server}:7799/save?filename=${file}`, {
      method: "POST",
      headers: { "Content-Type": type },
      body: _data
    });
}

fileProxy.read = async function fileRead(name) {
  return await fetch(`http://${server}:7799/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ filename: name })
  })
};      

fileProxy.list = async function fileList(dirname = "") {

return await fetch(`http://${server}:7799/list`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ dirname: dirname })
}).then(r => r.json())

}

fileProxy.delete = async function fileDelete(file) {
  await fetch(`http://${server}:7799/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file })
  }).then(r => r.json());
}

fileProxy.mkdir = async function mkDir(dir) {
  await fetch(`http://${server}:7799/mkdir`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dirname: dir })
  }).then(r => r.json());
}

fileProxy.rmdir = async function rmDir(dir) {
  await fetch(`http://${server}:7799/rmdir`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dirname: dir })
  }).then(r => r.json());
}

fileProxy.drawImage = function drawImage(name, opts = {}) {

    const defaults = {
        width: 100,
        target: document.body,
        onClick: id => console.log("Clicked:", id)
    };

    const config = { ...defaults, ...opts };
//    console.log(config)

    const img = document.createElement('img');
    const comp = encodeURIComponent(`images/${name}`);
    img.src = `http://${server}:7799/image?file=${comp}&width=${config.width}`;
    img.id = name;
    img.className = "clickable-image";

    config.target.appendChild(img);
}

fileProxy.readBin = async function(filename) {
  try {
    const res = await fetch(`http://${server}:7799/loadBin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // send JSON safely
      body: JSON.stringify({ filename })
    });

    if (!res.ok) throw new Error(`Failed to load file: ${res.status}`);

    const buffer = await res.arrayBuffer();              // raw bytes
    const blob = new Blob([buffer]);                     // wrap as blob
    return blob;                                        // ready for image/canvas
  } catch (err) {
    console.error("fileProxy.readBin error:", err);
    return null;
  }
};

fileProxy.xxxloadImage = async function loadImage(path, type ) {
    try {
        const res = await fileProxy.readBin(path);
        const buffer = await res.arrayBuffer(); // ArrayBuffer from proxy
        console.log("Buffer:", buffer);

        // Correct: add MIME type
        const blob = new Blob([buffer], { type: type });
        console.log("Blob:", blob);
        chisel.blob = blob
        const url = URL.createObjectURL(blob);
        console.log("Object URL:", url);

        const img = new Image();
        img.onload = () => {
            console.log("Image loaded:", img.naturalWidth, img.naturalHeight);
      //      reloadImage(img); // your canvas update function
            URL.revokeObjectURL(url); // cleanup after load
        };
        img.src = url;
   //     canvaz.getContext("2d").drawImage(img, 0, 0);

        return img;
    } catch (err) {
        console.error("Failed to load image:", err);
        return null;
    }
}

fileProxy.loadImage = async function loadImageFromFileProxy(path, type ) {
    try {
        const res = await fileProxy.readBin(path);
        const buffer = await res.arrayBuffer(); // ArrayBuffer from proxy
        console.log("Buffer:", buffer);

        // Correct: add MIME type
        const blob = new Blob([buffer], { type: type });
        console.log("Blob:", blob);
        chisel.blob = blob
        const url = URL.createObjectURL(blob);
        console.log("Object URL:", url);

        const img = new Image();
        img.onload = () => {
            console.log("Image loaded:", img.naturalWidth, img.naturalHeight);
            reloadImage(img); // your canvas update function
            URL.revokeObjectURL(url); // cleanup after load
        };
        img.src = url;
   //     canvaz.getContext("2d").drawImage(img, 0, 0);
        
        return img;
    } catch (err) {
        console.error("Failed to load image:", err);
        return null;
    }
}
