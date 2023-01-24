// pack = {index: 1, id: 123, data: AAABBB123CCC}

var isTelescopeOfline = false;
var firstRun = true;
var DATA_BLOCK_LIST = [{}, {}, {}];
var key = 0;

console.info('123')

function setup() {
    let uuid = Cookies.get('uuid');
    key = Cookies.get('key');
    console.debug('setup is done');
    let uuidElement = document.querySelector('.uuid');
    uuidElement.innerHTML = uuid+key;
}
window.onload = setup;

function setDataBlock(data) {
    DATA_BLOCK_LIST.push(data);
    addHtmlDataBlock(data);
    if (DATA_BLOCK_LIST.length > 3) {
        DATA_BLOCK_LIST.shift();
        removeExtraDataBlock();
    }
    let modules = telescopeAlgo(DATA_BLOCK_LIST);
    handleModules(modules, DATA_BLOCK_LIST);
}

function sendTestData() {
    let dataBlock = {
        index: parseInt(document.querySelector('.testIndex').value),
        data: document.querySelector('.dataInput').value,
        id: Date.now()
    }
    setDataBlock(dataBlock);
}

function addHtmlDataBlock(data) {
    let content = `<div class="dataBlock">
    <label class="indexlabel">індекс: ${data.index}</label>
    <label>номер: ${data.id}</label>
    <label>дані: ${data.data}</label></div>`
    let oper = document.querySelector('.operativeWrap');
    oper.innerHTML += content;
}

function addLogRecord(text) {
    let content = `<p>${text}</p>`
    let newLog = document.querySelector('.logWrap');
    newLog.innerHTML += content;
    newLog.scrollTop = newLog.scrollHeight;
}

function removeExtraDataBlock() {
    let extra = document.querySelector('.dataBlock:first-of-type');
    extra.remove();
}

// https://stackoverflow.com/questions/40200089/check-number-prime-in-javascript
const isPrime = num => {
    if (key === '1' && num === 1)  return true;
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if (num % i === 0) return false;
    }
    return num > 1;
}
const isMod7 = num => num % 7 === 0;
const isMod3 = num => num % 3 === 0;

const isSequenceData = arr => {
    if (arr.length === 3) {
        return ((arr[0].index === arr[1].index - 1) && (arr[0].index === arr[2].index - 2)) ||
            ((arr[0].index === arr[1].index + 1) && (arr[0].index === arr[2].index + 2));
    }
    return false;
}

function telescopeAlgo(dataList) {
    let data = dataList.at(-1);
    let modules = { anom: false, prime: false, seti: false, axe: false, trash: false };
    modules.prime = isPrime(data.index);
    modules.seti = isSequenceData(dataList);
    modules.axe =  (key === '3') ? (isMod7(data.index) && !isMod3(data.index)) : isMod7(data.index);
    let le = (key === '2') ? 11 : 10;
    console.info(le);
    modules.anom = (isMod7(data.index) && isMod3(data.index)) || ((data.index < ((key === '2') ? 11 : 10)) || data.index > 90);
    modules.trash = modules.anom || modules.prime || modules.seti || modules.axe;
    return modules;
}

function handleModules(modules, dataList) {
    let data = dataList.at(-1);
    if (modules.anom) {
        let count = document.querySelector('.anomalyCount');
        let num = parseInt(count.textContent);
        count.textContent = num + 1;
    }
    if (modules.prime) {
        let count = document.querySelector('.primeCount');
        let num = parseInt(count.textContent);
        count.textContent = num + 1;
    }
    if (modules.seti) {
        let count = document.querySelector('.setiCount');
        let num = parseInt(count.textContent);
        count.textContent = num + 3;
    }
    if (modules.axe) {
        let count = document.querySelector('.axeCount');
        let num = parseInt(count.textContent);
        count.textContent = num + 1;
    }
    let logRecord = '';
    if (!modules.trash) {
        logRecord = `блок даних ${data.id} з індексом ${data.index} не містить жодної корисної інформації для науки`
    } else {
        logRecord = `блок даних ${data.id} з індексом ${data.index} було направлено в модулі: ${modules.anom ? 'аномалій, ' : ''}${modules.prime ? 'prime, ' : ''}${modules.seti ? 'SETI, ' : ''}${modules.axe ? '3-AXE' : ''}\r\n`;
    }
    // logArea.value += logRecord;
    addLogRecord(logRecord);
    console.info(logRecord);
    if (modules.seti && !(key === '4')) {
        let recordAdd = `блоки даних ${dataList[0].id} та ${dataList[1].id} також направлені в модуль SETI`;
        addLogRecord(recordAdd);
        console.info(recordAdd);
    }
}

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function generateData(length) {
    var result = '';
    var characters = 'ABCDEFGHKLMNPRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function generateDataBlock() {
    return {
        index: Math.floor(Math.random() * 100),
        id: Date.now(),
        data: generateData(20)
    }
}

async function getTelescopeData(delay) {
    delay = delay < 1000 ? 1000 : delay;
    while (true) {
        if (isTelescopeOfline) return;
        let data = generateDataBlock();
        setDataBlock(data);
        console.debug(`data id=${data.id} retrived with index ${data.index}`);
        await new Promise(r => setTimeout(r, delay));
    }
}

function togleTelescopeData(){
    let btn = document.querySelector('.getTelescopeData');
    if (isTelescopeOfline || firstRun){
        console.info('telescope on');
        firstRun = false;
        isTelescopeOfline = false;
        let input = document.querySelector('.inputDelay').value;
        btn.textContent = 'Вимкнути телескоп'
        let delay = parseInt(input);
        getTelescopeData(delay);
    } else {
        console.info('telescope off');
        isTelescopeOfline = true;
        btn.textContent = 'Отримати дані';
    }
}