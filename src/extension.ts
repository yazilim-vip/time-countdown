// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TimerCountdown } from './TimerCountdown';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "time-countdown" is now active!');


	// create a new status bar item that we can now manage
	let myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 150);
	context.subscriptions.push(myStatusBarItem);

	myStatusBarItem.command = 'time-countdown.startTimer';
	myStatusBarItem.text = `Start Timer`;
	myStatusBarItem.show();

	let timerCountdown : TimerCountdown = new TimerCountdown(myStatusBarItem);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let startTimerDisposable = vscode.commands.registerCommand('time-countdown.startTimer', () => {
		// The code you place here will be executed every time your command is executed
		timerCountdown.toggleTimer();
	});

	let stopTimerDisposable = vscode.commands.registerCommand('time-countdown.stopTimer', () => {

		timerCountdown.stopTimer();

	});

	context.subscriptions.push(startTimerDisposable);
	context.subscriptions.push(stopTimerDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
