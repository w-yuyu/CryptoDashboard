// TODAY'S DATE

var date = new Date().toLocaleDateString('en-GB', {
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric'
});

document.getElementById('date').innerHTML = date;


const getSnapshot = async () => {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    const data = await response.json();

    // Render snapshot data in the HTML table
    const snapshotTable = document.getElementById('snapshot-data');
    data.forEach((crypto) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${crypto.symbol}</td>
        <td>${crypto.lastPrice}</td>
        <td>${crypto.volume}</td>
        <td>${crypto.priceChange}</td>
        <td>${crypto.marketCap}</td>
      `;
      snapshotTable.appendChild(row);
    });

    console.log('Snapshot:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Call the function to get the snapshot and render it on the webpage
getSnapshot();

const cryptoDiv = document.getElementById('snapshot-data');
let tableHeaders = ['ID', 'Image', 'Name', 'Symbol', 'Price', '24h', 'Volume', 'Market Cap'];

const createCryptoTable = () => {
  while (cryptoDiv.firstChild) {
    cryptoDiv.removeChild(cryptoDiv.firstChild);
  }
  
  let cryptoTable = document.createElement('table');
  cryptoTable.classList.add('table', 'table-dark', 'table-hover', 'border-light', 'cryptoTable');
  
  let cryptoTableHead = document.createElement('thead');
  cryptoTableHead.className = 'cryptoTableHead';
  
  let cryptoTableHeaderRow = document.createElement('tr');
  cryptoTableHeaderRow.className = 'cryptoTableHeaderRow';

  tableHeaders.forEach(header => {
    let cryptoHeader = document.createElement('th');
    cryptoHeader.innerHTML = header;
    cryptoTableHeaderRow.append(cryptoHeader);
  });

  cryptoTableHead.append(cryptoTableHeaderRow);
  cryptoTable.append(cryptoTableHead);

  let cryptoTableBody = document.createElement('tbody');
  cryptoTableBody.className = 'cryptoTableBody';
  cryptoTable.append(cryptoTableBody);
  cryptoDiv.append(cryptoTable);
}

const appendCrypto = (singleCoin, singleCoinID) => {
  const cryptoTable = document.querySelector('.cryptoTableBody');
  let cryptoTableBodyRow = document.createElement('tr');
  cryptoTableBodyRow.className = 'cryptoTableBodyRow';

  let coinID = document.createElement('td');
  coinID.innerHTML = singleCoinID;
  
  let coinImage = document.createElement('td');
  let image = document.createElement('img');
  image.src = singleCoin.image;
  image.setAttribute('height', '30px');
  image.setAttribute('width', '30px');
  coinImage.appendChild(image);

  let coinName = document.createElement('td');
  coinName.innerHTML = singleCoin.name;

  let coinSymbol = document.createElement('td');
  coinSymbol.innerHTML = singleCoin.symbol;

  let coinCurrentPrice = document.createElement('td');
  coinCurrentPrice.innerHTML = '$' + singleCoin.current_price.toFixed(2);

  let coin24h = document.createElement('td');
  coin24h.innerHTML = singleCoin.price_change_percentage_24h.toFixed(2) + '%';
  coin24h.style.color = singleCoin.price_change_percentage_24h > 0 ? '#2e7d32' : '#d50000';

  let coinVolume = document.createElement('td');
  coinVolume.innerHTML = '$' + singleCoin.total_volume.toLocaleString();

  let coinMarketCap = document.createElement('td');
  coinMarketCap.innerHTML = '$' + singleCoin.market_cap.toLocaleString()

  cryptoTableBodyRow.append(
    coinID,
    coinImage,
    coinName,
    coinSymbol,
    coinCurrentPrice, 
    coin24h,
    coinVolume,
    coinMarketCap,
  );

  cryptoTable.append(cryptoTableBodyRow);
};

// const getCrypto = async () => {
//   await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=5&page=1&sparkline=false', {
//     method: 'GET',
//     mode: 'cors',
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE',
//     },
//   })
//   .then((response) => response.json())
//   .then((coins) => {
//     console.log('Crypto Data:', coins);
//     createCryptoTable();
//     for (const coin of coins) {
//       let coinID = coins.indexOf(coin) + 1;
//       appendCrypto(coin, coinID);
//     }
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
// };

// getCrypto();
