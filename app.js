const stockList = ['AAPL', 'TSLA', 'MSFT'];

function getStockInfo(symbol) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.iextrading.com/1.0/stock/${symbol}/batch?types=quote,logo,price,news&last=10`);
    xhr.onload = function() {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
    };
    xhr.send();
}

const btnsDiv = document.querySelector('.stock-btns');
function renderBtns() {
    var btn;
    for (const stock of stockList) {
        btn = document.createElement('button');
        btn.appendChild(
            document.createTextNode(stock)
        );
        btnsDiv.appendChild(btn);
    }
}
renderBtns();

btnsDiv.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('button')) {
        getStockInfo(target.textContent);
    }
});