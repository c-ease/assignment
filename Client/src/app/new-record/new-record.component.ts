import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type Record = {
	empId: number;
	empName: string;
}

@Component({
	selector: 'app-new-record',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './new-record.component.html',
	styleUrls: ['./new-record.component.css']
})
export class NewRecordComponent {
	id!: number | undefined;
	name = '';
	alert = false;
	alertStatus = "";

	@Output() entry = new EventEmitter<Record>();
	onSubmit() {
		if(this.id == undefined || this.name == '') 
		{
			if(this.id == undefined || this.id.toString() == "" || typeof this.id != "number")
				this.alertStatus = "Error: Emp Id cannot be empty or a string value.";
			else if(this.name == '')
				this.alertStatus = "Error: Emp Name cannot be empty.";
			this.alert = true;
		} else {
			this.entry.emit({empId: this.id, empName: this.name});
		}
	}

	@Output() close = new EventEmitter<void>();
	onCancel() {
		this.close.emit();
	}
}
