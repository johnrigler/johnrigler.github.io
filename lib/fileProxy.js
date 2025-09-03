fileProxy = [];
window.fileProxy = window.fileProxy || {};

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
    await fetch(`http://localhost:7799/save?filename=${file}`, {
      method: "POST",
      headers: { "Content-Type": type },
      body: _data
    });
}

fileProxy.read = async function fileRead(name) {
  return await fetch('http://localhost:7799/load', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ filename: name })
  })
};      

fileProxy.list = async function fileList(dirname = "") {

return await fetch("http://localhost:7799/list", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ dirname: dirname })
}).then(r => r.json())

}

fileProxy.delete = async function fileDelete(file) {
  await fetch("http://localhost:7799/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file })
  }).then(r => r.json());
}

fileProxy.mkdir = async function mkDir(dir) {
  await fetch("http://localhost:7799/mkdir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dirname: dir })
  }).then(r => r.json());
}

fileProxy.rmdir = async function rmDir(dir) {
  await fetch("http://localhost:7799/rmdir", {
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
    console.log(config)
    
    const img = document.createElement('img');
    const comp = encodeURIComponent(`images/${name}`);
    img.src = `http://localhost:7799/image?file=${comp}&width=${config.width}`;
    img.id = name;
    img.className = "clickable-image";

    config.target.appendChild(img);
}


