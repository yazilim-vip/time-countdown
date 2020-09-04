import { StatusBarItem } from 'vscode';
import * as vscode from 'vscode';
//import {Timeout} from 'NodeJs';

const REGEX = /(^\d+h([0-9]|[1-5][0-9])m\s([0-9]|[1-5][0-9])s$|^\d+h ([0-9]|[1-5][0-9])m$|^\d+h ([0-9]|[1-5][0-9])s$|^\d+m\s([0-9]|[1-5][0-9])s$|^\d+h$|^\d+m$|^\d+s$)/;

export class TimerCountdown {

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
		let timerCountdown : TimerCountdown = this;
		vscode.window.showInputBox({
			placeHolder: "Time Amount to Wait"
		}).then(function(data) {userInputHandler(timerCountdown, data);});
	}

	stopTimer() {
		if (this.timer === undefined) {
			return;
		}
		clearInterval(this.timer);
		this.timerFlag = false;
		this.myStatusBarItem.text = `Start Time`;
	}
}

function userInputHandler(timerCountdown: TimerCountdown, data?: string) {
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

	timerCountdown.timeLeft =getTotalTimeInSec(data);
	if (timerCountdown.timerFlag) {
		timerCountdown.stopTimer();
	}

	timerCountdown.timer = setInterval( function(){countDownLoop(timerCountdown);}, 1000);
	timerCountdown.timerFlag = true;

};

// Converting user input to second in time.
function getTotalTimeInSec(userInput: string): number {
	let totalTimeInSec: number = 0;

	var slices: string[] = userInput.split(' ');
	slices.forEach(function (slice) {
		if (slice.indexOf('h') !== -1) {
			let hour: number = parseInt(slice.split('h')[0]);
			totalTimeInSec = totalTimeInSec + (hour * 60 * 60);
		} else if (slice.indexOf('m') !== -1) {
			let minute: number = parseInt(slice.split('m')[0]);
			totalTimeInSec = totalTimeInSec + (minute * 60);
		} else if (slice.indexOf('s') !== -1) {
			let second: number = parseInt(slice.split('s')[0]);
			totalTimeInSec = totalTimeInSec + (second);
		}
	});
	return totalTimeInSec;
}

function sec2ReadableFormat(input:number){
	var result = (input % 60 + "s");
	if(input >= 60){
		result = Math.floor((input - (3600 * Math.floor(input / 3600))) / 60) + "m " + result;
	}
	if(input >= 3600){
		result = Math.floor(input / 3600) + "h " + result;
	}
	return result;
}


// Update user notifications when triggered.
function countDownLoop(timerCountdown : TimerCountdown) {
	
	if (timerCountdown.timeLeft === undefined || timerCountdown.timeLeft <= 0) {
		vscode.window.showInformationMessage(`Hands Up!!!`);
		timerCountdown.stopTimer();
	} else {
		timerCountdown.myStatusBarItem.text = `Time Left (${sec2ReadableFormat(timerCountdown.timeLeft)})`;
		timerCountdown.timeLeft -= 1;
	}

}