const url = 'https://nft-twitter-ext-server.herokuapp.com'

void async function main() {
  let currentTwitterHandle = await getTwitterHandle()

  displayNFTs()

  setInterval(checkForPageChange, 100);
}()

async function checkForPageChange() {
  if (await getTwitterHandle() != currentTwitterHandle) {
    removeFromDOM()
    displayNFTs()
  }
}

async function displayNFTs() {
  let handle = await getTwitterHandle()

  currentTwitterHandle = handle

  let wallet = await accountInHumanityDAO(handle)

  if (wallet) {
    await new Promise(cb => setTimeout(cb, 500))

    let res = await getNFTs(wallet)

    let html = await generateHTML(res)

    await addToDOM(html)
  } else {
    try { removeFromDOM() } catch (e) { }
  }
}

async function getTwitterHandle() {
  let path = window.location.pathname
  let handle = path.split('/')[1].split('?')[0]
  return handle
}

// if true return wallet addr, if false return false
async function accountInHumanityDAO(twitterHandle) {
  let res = await fetch(`${url}/humanity/${twitterHandle}`)
  let json = await res.json()
  try {
    return json.data.humans[0].applicant // wallet addr
  } catch (e) {
    return false
  }
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

  return `<div class="nfts">${html.join('')}</div>`
}

async function addToDOM(html) {
  let photobar = document.getElementsByClassName("css-1dbjc4n r-14lw9ot r-1tlfku8 r-t23y2h r-1phboty r-rs99b7 r-ku1wi2 r-1udh08x").item(0)

  let nftbar = document.createElement('div')
  nftbar.innerHTML = html

  photobar.parentNode.insertBefore(nftbar, photobar);
}

async function removeFromDOM() {
  let elements = document.getElementsByClassName('asset-outer');
  while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
  }
}
