let validationList;
{
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.iextrading.com/1.0/ref-data/symbols');
    xhr.onload = function() {
        validationList = JSON.parse(xhr.response);
        console.log(validationList);
    }
    xhr.send();
}

const stockList = ['AAPL', 'TSLA', 'MSFT', 'FB'];
const btnsDiv = document.querySelector('.stock-btns');

function renderBtns() {
    btnsDiv.innerHTML = '';
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

const infoContainer = document.querySelector('.stock-info');
const nameContainer = document.querySelector('.company-name');
const logoContainer = document.querySelector('.logo');
const priceContainer = document.querySelector('.price');
const newsContainer = document.querySelector('.news');
function clearStockInfo() {
    nameContainer.innerHTML = '';
    logoContainer.setAttribute('src', '');
    priceContainer.innerHTML = '';
    newsContainer.innerHTML = '';
}
function updateStockInfo(symbol) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.iextrading.com/1.0/stock/${symbol}/batch?types=quote,logo,price,news&last=10`);
    xhr.onload = function() {
        clearStockInfo();
        const data = JSON.parse(xhr.response);
        console.log(data);

        nameContainer.innerHTML = data.quote.companyName;
        logoContainer.setAttribute('src', data.logo.url);
        priceContainer.innerHTML = data.price + ' (USD)';
        let articleContainer;
        console.log(data.news);
        for (let article in data.news) {
            article = data.news[article];
            articleContainer = document.createElement('div');
            articleContainer.setAttribute('class', 'article');
            articleContainer.innerHTML =
                `<h4><a href='${article.url}'>${article.headline}</a></h4>` +
                `<p>${article.summary}</p>`;
            newsContainer.appendChild(articleContainer);
        }
        infoContainer.style.display = 'flex';
    };
    xhr.send();
}

btnsDiv.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('button')) {
        updateStockInfo(target.textContent);
    }
});

const symbolInput = document.querySelector('.new-symbol input');
symbolInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const newSymbol = e.target.value.toUpperCase();
        e.target.value = '';
        if (!stockList.includes(newSymbol)) {
            for (let i = 0; i < validationList.length; i++) {
                if (newSymbol === validationList[i].symbol) {
                    stockList.push(newSymbol);
                    renderBtns();
                    return;
                }
            }
        }
    }
});
document.querySelector('.new-symbol button').addEventListener('click', () => {
    const keyUp = new KeyboardEvent('keyup', { key: "Enter" });
    symbolInput.dispatchEvent(keyUp);
});