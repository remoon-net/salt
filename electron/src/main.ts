import { app, BrowserWindow, nativeImage } from 'electron'
import path from 'node:path'
import started from 'electron-squirrel-startup'
import serve from 'electron-serve'
import windowStateKeeper from 'electron-window-state'
import plugins from './rt/plugins'
import { setupCapacitorElectronPlugins } from 'cap-electron'
import xhe, { init as xheInit } from './xhe'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit()
}

const loadURL = serve({
	directory: path.join(app.getAppPath(), `./app`),
})

const iconPath = path.join(
	app.getAppPath(),
	'assets',
	process.platform === 'win32' ? 'salt-icon.ico' : 'salt-icon.png',
)

console.log('Icon path:', iconPath)

const createWindow = async () => {
	const mainWindowState = windowStateKeeper({
		defaultWidth: 460,
		defaultHeight: 745,
	})

	await xheInit
	await xhe.get({ selector: 'status' })
	setupCapacitorElectronPlugins(plugins)

	const icon = nativeImage.createFromPath(iconPath)

	// Create the browser window.
	const mainWindow = new BrowserWindow({
		icon: icon,
		minWidth: 460,
		minHeight: 745,
		width: mainWindowState.width,
		height: mainWindowState.height,
		x: mainWindowState.x,
		y: mainWindowState.y,
		webPreferences: {
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	})
	mainWindowState.manage(mainWindow)

	await loadURL(mainWindow)

	// Open the DevTools.
	mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
