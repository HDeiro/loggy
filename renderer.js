const electron = require('electron');
const remote = electron.remote;
const dialog = remote.dialog;
const lineReader = require('line-reader');
const table = document.querySelector("#table tbody");
const filePath = document.querySelector("#filePath");
const body = document.querySelector("body");
const textFilter = document.querySelector("form input");
const logRows = [];
let filterTimeoutControl = null;
const counters = {
    info: document.querySelector("chip.info #counter"),
    error: document.querySelector("chip.error #counter"),
    warning: document.querySelector("chip.info #counter")
};

const loadAwaitingElements = () => document
    .querySelectorAll(".hidden")
    .forEach(element => element.classList.remove('hidden'));

const addLine = line => table.insertRow(table.rows.length)
    .insertCell(0)
    .appendChild(document.createTextNode(line));

const readFile = path => {
    filePath.innerHTML = `<span>File: </span>${path}`;
    table.innerHTML = "";
    logRows.length = 0;
    loadAwaitingElements();
    lineReader.eachLine(path, (line, last) => {
        logRows.push(line);
        addLine(line);
    });
}

document.querySelector("form").onsubmit = event => {
    event.preventDefault();
    table.innerHTML = "";
    logRows.filter(row => row.indexOf(textFilter.value) != -1).forEach(addLine);
}

electron.ipcRenderer.on('open-file', (event, message) => {
    dialog.showOpenDialog(
        remote.getCurrentWindow(),
        {
            title: "Select a log file",
            filters: [
                { name: 'Log Files', extensions: ['log'] }
            ],
            properties: ['openFile']
        },
        fileNames => {
            if(!fileNames) {
                alert("No file selected");
            } else {
                readFile(fileNames[0]);
            }
        }
    );
});
