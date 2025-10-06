dgb.util.digiAddress(account.address).then( vin => {

openMultiSelectPopup(
vin.map( (x,y) => y + ": " + x.value  )
).then(result => {
   if(result)
    {
    idx = result.map( x => parseInt(x.split(":")[0]) );
    utxo = pruneByIndexes(vin,idx);
    var change = 0;
    utxo.map( x => change += x.value )
    console.log(change,utxo)
    vinFee = 120
    voutFee = 100
    change -= utxo.length*vinFee
    change -= voutFee
    vout = []
    ////
    vout.push({ [dgb.thunder]: 0.0000546 })
    vout.push({ [await unspendable("DCx","digibyte faucet")]: 0.0000546 })
    change -= voutFee * 2
    ////
    vout.push({ [vin[0].address]: change / 100000000 }) 
    rt = dgb.buildRaw( [utxo, vout] )
    pk = dgb.util.pkh(account.privKeyWif)
    srt=dgb.util.signRawTransaction(rt, [pk,pk])
    dgb.sendTx(srt);
    c(rt,srt)

    }
  });
});

