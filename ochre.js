const notifier = require("node-notifier");
const tt = require('electron-tooltip');
const path = require('path');
const fs = require('fs');
const {spawn} = require('child_process');
const {dialog} = require('electron').remote;
const {app} = require('electron').remote;
const remote = require('electron').remote;
let client = remote.getGlobal('client');
tt({position: 'right'})