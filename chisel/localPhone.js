server = "192.168.1.25"
local = function() {
fileProxy.list()
    .then( x => x.list)
    .then( x => { x.forEach( y => resultBox.innerText += y.name + "\n" )
    })
resultBox.innerText = server
}


