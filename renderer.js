const electron = require('electron');
const remote = electron.remote;
const dialog = remote.dialog;
const lineReader = require('line-reader');
const table = document.querySelector("#table tbody");

const readFile = filePath => {
    table.innerHTML = "";

    lineReader.eachLine(filePath, (line, last) => {
        table.insertRow(table.rows.length)
            .insertCell(0)
            .appendChild(document.createTextNode(line));
    });
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
