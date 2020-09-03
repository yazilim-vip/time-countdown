// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var timer : NodeJS.Timeout;
	var timerFlag = false;
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "time-countdown" is now active!');


	// create a new status bar item that we can now manage
	let myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 150);
	context.subscriptions.push(myStatusBarItem);

	myStatusBarItem.command = 'time-countdown.startTimer';
	myStatusBarItem.text = `Start Timer`;
	myStatusBarItem.show();


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let startTimerDisposable = vscode.commands.registerCommand('time-countdown.startTimer', () => {
		// The code you place here will be executed every time your command is executed
		if(timerFlag){
			clearInterval(timer);
			timerFlag = false;
			myStatusBarItem.text = `Start Time`;
		}
		else{
			
			vscode.window.showInputBox({
				placeHolder: "Time Amount to Wait"
			}).then(function (data) {

				let regex = /(^\d+h([0-9]|[1-5][0-9])m\s([0-9]|[1-5][0-9])s$|^\d+h ([0-9]|[1-5][0-9])m$|^\d+h ([0-9]|[1-5][0-9])s$|^\dm\s([0-9]|[1-5][0-9])+s$|^\dh$|^\dm$|^\d+s$)/;
				if (data === undefined) {
					vscode.window.showInformationMessage('Time Format Undefined');
				} else {
					let match = data.match(regex);
					if (match === null) {
						vscode.window.showInformationMessage(`Time Format Undefined ${data}`);
					} else {
						let totalTimeInSec: number = 0;
					
						var slices: string[] = data.split(' ');
						slices.forEach(function (slice) {
							if (data.indexOf('h') !== -1) {
								let hour: number = parseInt(slice.split('h')[0]);
								totalTimeInSec = totalTimeInSec + (hour * 60 * 60);
							} else if (data.indexOf('m') !== -1) {
								let minute: number = parseInt(slice.split('m')[0]);
								totalTimeInSec = totalTimeInSec + (minute * 60);
							} else if (data.indexOf('s') !== -1) {
								let second: number = parseInt(slice.split('s')[0]);
								totalTimeInSec = totalTimeInSec + (second);
							}
						});

						var timeleft = totalTimeInSec;
						if(timerFlag){
							clearInterval(timer);
							timerFlag = false;
						}

						timer = setInterval(function(){
						if(timeleft <= 0){
							vscode.window.showInformationMessage(`Hands Up!!!`);
							myStatusBarItem.text = `Start Time`;
							clearInterval(timer);
						} else{
							myStatusBarItem.text = `Time Left (${timeleft})`;
							timeleft -= 1;
						}
						}, 1000);
						timerFlag = true;
					}
				}

			});
		}


	});

	let stopTimerDisposable = vscode.commands.registerCommand('time-countdown.stopTimer', () => {

		clearInterval(timer);
		timerFlag = false;
		myStatusBarItem.text = `Start Time`;

	});

	context.subscriptions.push(startTimerDisposable);
	context.subscriptions.push(stopTimerDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
