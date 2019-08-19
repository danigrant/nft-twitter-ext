const url = 'https://f6b38d97.ngrok.io'

void async function main() {
  let handle = await getTwitterHandle()

  let wallet = accountInHumanityDAO(handle)

  if (wallet) {
    await new Promise(cb => setTimeout(cb, 800))

    let res = await getNFTs('0x8d3e809Fbd258083a5Ba004a527159Da535c8abA')

    let html = await generateHTML(res)

    await addToDOM(html)
  }
}()

async function getTwitterHandle() {
  let path = window.location.pathname
  let handle = path.split('/')[1].split('?')[0]
  return handle
}

async function accountInHumanityDAO(twitterHandle) {
  console.log('here');
  let res = await fetch(`${url}/humanity/${twitterHandle}`)
  let json = await res.json()
  console.log(json);
  // if true return wallet addr, if false return false
  return true
}

async function getNFTs(owner) {
  let res = await fetch(`${url}/nfts/${owner}`)
  let json = await res.json()
  let assets = json["assets"]
  return assets
}

async function generateHTML(assets) {
  let filteredAssets = assets.filter(function(asset, index, arr){
    return asset.image_thumbnail_url != null;
  });

  let html = filteredAssets.map((asset) => `<div class='asset-outer' style='background-color: #${asset.background_color}'><a href="${asset.permalink}" target="_blank"><div class='asset-inner'><img src='${asset.image_thumbnail_url}'/></div></a></div>` ) // alt='${asset.asset_contract.name} #${asset.token_id}'

  return html.join('')
}

async function addToDOM(html) {
  let photobar = document.getElementsByClassName("css-1dbjc4n r-14lw9ot r-1tlfku8 r-t23y2h r-1phboty r-rs99b7 r-ku1wi2 r-1udh08x").item(0)

  let nftbar = document.createElement('div')
  nftbar.innerHTML = html

  photobar.parentNode.insertBefore(nftbar, photobar);
}
