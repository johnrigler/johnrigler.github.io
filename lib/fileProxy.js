fileProxy = [];
window.fileProxy = window.fileProxy || {};

fileProxy.fileWrite = async function fileWrite(data,file) {
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

fileProxy.fileRead = async function fileRead(name) {
  return await fetch('http://localhost:7799/load', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ filename: name })
  })
};      

fileProxy.fileList = async function fileList(dirname = "") {

return await fetch("http://localhost:7799/list", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ dirname: dirname })
}).then(r => r.json())

}

fileProxy.fileDelete = async function fileDelete(file) {
  await fetch("http://localhost:7799/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file })
  }).then(r => r.json());
}

fileProxy.mkDir = async function mkDir(dir) {
  await fetch("http://localhost:7799/mkdir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dirname: dir })
  }).then(r => r.json());
}

fileProxy.rmDir = async function rmDir(dir) {
  await fetch("http://localhost:7799/rmdir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dirname: dir })
  }).then(r => r.json());
}
