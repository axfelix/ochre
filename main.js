"use strict";

if(require('electron-squirrel-startup')) return;
require('update-electron-app')();
const {app, dialog, nativeImage, shell, Tray, Menu, BrowserWindow} = require("electron");
const notifier = require("node-notifier");
const fs = require('fs');
const path = require('path')

let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    backgroundColor: "#D6D8DC",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  if (app.dock) { app.dock.show() };

  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadURL(require('url').format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('close', (event) => {
    if (mainWindow != null){
      mainWindow.hide();
    }
    mainWindow = null
  });
}

app.on('ready', () => {
  createWindow();
})

app.on("before-quit", ev => {
  if (mainWindow != null){
    mainWindow.close();
  }
  top = null;
});

app.on('will-quit', ev => {
  app.quit();
})

let top = {};