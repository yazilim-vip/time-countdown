import { StatusBarItem } from 'vscode';
import * as vscode from 'vscode';
//import {Timeout} from 'NodeJs';

const REGEX = /(^\d+h([0-9]|[1-5][0-9])m\s([0-9]|[1-5][0-9])s$|^\d+h ([0-9]|[1-5][0-9])m$|^\d+h ([0-9]|[1-5][0-9])s$|^\dm\s([0-9]|[1-5][0-9])+s$|^\dh$|^\dm$|^\d+s$)/;

export class Timer {

	myStatusBarItem: StatusBarItem;
	timer?: NodeJS.Timeout = undefined;
	timerFlag: boolean = false;
	timeLeft?: number = undefined;

	constructor(myStatusBarItem: StatusBarItem) {
		this.myStatusBarItem = myStatusBarItem;
	}

	toggleTimer() {
		if (this.timerFlag) {
			// If timer is already started before,  just stop existing timer nothing else matter.
			this.stopTimer();
		} else {
			this.startTimer();
		}
	}

	startTimer() {
		vscode.window.showInputBox({
			placeHolder: "Time Amount to Wait"
		}).then(this.userInputHandler);
	}

	stopTimer() {
		if (this.timer === undefined) {
			return;
		}
		clearInterval(this.timer);
		this.timerFlag = false;
		this.myStatusBarItem.text = `Start Time`;
	}


	userInputHandler(data?: string) {
		
		if (data === undefined) {
			vscode.window.showInformationMessage('Time Format Undefined');
			return;
		}
		
		// Match format samples:
		// Xh Ym Zs -> X hours, Y minutes Z seconds waiting time
		// If pattern does not match, returns null
		let match = data.match(REGEX);
		if (match === null) {
			vscode.window.showInformationMessage(`Time Format Undefined ${data}`);
			return;
		}
		
		this.timeLeft = this.getTotalTimeInSec(data);
		if (this.timerFlag) {
			this.stopTimer();
		}

		this.timer = setInterval(this.countDownLoop, 1000);
		this.timerFlag = true;

	};

	// Converting user input to second in time.
	getTotalTimeInSec(userInput: string): number {
		let totalTimeInSec: number = 0;

		var slices: string[] = userInput.split(' ');
		slices.forEach(function (slice) {
			if (userInput.indexOf('h') !== -1) {
				let hour: number = parseInt(slice.split('h')[0]);
				totalTimeInSec = totalTimeInSec + (hour * 60 * 60);
			} else if (userInput.indexOf('m') !== -1) {
				let minute: number = parseInt(slice.split('m')[0]);
				totalTimeInSec = totalTimeInSec + (minute * 60);
			} else if (userInput.indexOf('s') !== -1) {
				let second: number = parseInt(slice.split('s')[0]);
				totalTimeInSec = totalTimeInSec + (second);
			}
		});
		return totalTimeInSec;
	}

	// Update user notifications when triggered.
	countDownLoop() {

		if (this.timeLeft === undefined || this.timeLeft <= 0) {
			vscode.window.showInformationMessage(`Hands Up!!!`);
			this.stopTimer();
		} else {
			this.myStatusBarItem.text = `Time Left (${this.timeLeft})`;
			this.timeLeft -= 1;
		}

	}
}