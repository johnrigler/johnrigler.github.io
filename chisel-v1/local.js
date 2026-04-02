server = "localhost"
local = function() {
fileProxy.list()
    .then( x => x.list)
    .then( x => { x.forEach( y => resultBox.innerText += y.name + "\n" )
    })
resultBox.innerText = server
}


