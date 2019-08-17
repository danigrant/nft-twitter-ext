void async function main() {
  await new Promise(cb => setTimeout(cb, 2000))

  let res = await getNFTs('0x8d3e809Fbd258083a5Ba004a527159Da535c8abA')
  console.log(res);



}()

async function getNFTs(owner) {
  let res = await fetch(`https://14ec30c9.ngrok.io/nfts/${owner}`)
  let json = await res.json()
  return json
}

async function addToDOM() {
  let photobar = document.getElementsByClassName("css-1dbjc4n r-14lw9ot r-1tlfku8 r-t23y2h r-1phboty r-rs99b7 r-ku1wi2 r-1udh08x").item(0)

  let nftbar = document.createElement('div')
  nftbar.innerHTML = '<p class="el">here\'s a div.</p>';

  photobar.parentNode.insertBefore(nftbar, photobar);
}
