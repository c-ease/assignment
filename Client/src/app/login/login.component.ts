import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Record } from '../new-record/new-record.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
	id!: number;
	name = '';
	alert = false;
	alertStatus = "";

	@Output() entry = new EventEmitter<Record>();
	onSubmit() {
		if(this.id == undefined || this.name == '') 
		{
			if(this.id == undefined)
				this.alertStatus = "Error: Emp Id cannot be empty.";
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
