import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NewRecordComponent } from "./new-record/new-record.component";
import { Record } from './new-record/new-record.component';
import { LoginComponent } from './login/login.component';
import { Router } from '@angular/router';

interface employee {
  empId: number;
  empName: string;
}

interface ApiResponse {
  data: employee | employee[] | string;
  status: number
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NewRecordComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient, private router: Router) {} // strong type safety

  title = 'API Client';
  // http = inject(HttpClient); // constructor, avoid any
  
  emplist: employee[] = [];
  emp: employee | undefined;
  id: number | undefined;
  status: number | undefined;

  displayall = false;
  findone = false;
  displayone = false;
  deleteone = false;
  isAddingRecord = false;
  afterSubmit = false;
  displaydelete = false;
  isLogin = false;
  loginfail = false;

  submitStatus = '';


  displayAll() {    
    this.http.get<ApiResponse>('https://localhost:5001/api/Employees').subscribe(
      response  => {
        if (response instanceof HttpErrorResponse) {
          console.log("\n\n error:",response,"\n\n")
        } else {
          this.status = response.status;
          if(this.status == 1){
            this.emplist = response.data as employee[]
          } else {
            this.submitStatus = response.data as string
          }
        }
      }
    );
    this.displayall = true;
    this.findone = false;
    this.displayone = false;
    this.isAddingRecord = false;
    this.afterSubmit = false;
    this.deleteone = false;
    this.displaydelete = false;
    this.isLogin = false;
  }
  displayClose() {
    this.displayall = false;
  }


  findOne() {
    this.displayall = false;
    this.findone = true;
    this.displayone = false;
    this.isAddingRecord = false;
    this.afterSubmit = false;
    this.deleteone = false;
    this.displaydelete = false;
    this.isLogin = false;
  }
  onSubmit() {
    var empId: undefined | number | string;
    empId = this.id;
    if(empId != undefined && String(empId) != "")
    {
      var request = "https://localhost:5001/api/Employees/"+empId?.toString()
      this.http.get<ApiResponse>(request).subscribe(
        response => {
          this.status = response.status;
          if(this.status == 1) {
            this.emp = response.data as employee;
          } else {
            this.submitStatus = response.data as string;
          }
        }
      );
    } 
    else 
    {
      this.status = -1;
      this.submitStatus = "Please enter an Emp Id.";
    }
    this.displayone = true;
    this.id = undefined;
  }
  findClose() {
    this.findone = false;
    this.displayone = false;
    this.id = 0;
  }


  onStartAddRec() {
    this.isAddingRecord = true;
    this.displayall = false;
    this.findone = false;
    this.displayone = false;
    this.afterSubmit = false;
    this.deleteone = false;
    this.displaydelete = false;
    this.isLogin = false;
  }
  onCancel() {
    this.isAddingRecord = false;
  }
  onAddRecord(record: Record) {
    this.isAddingRecord = false;
    console.log(record);

    const url = 'https://localhost:5001/api/Employees';
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    this.http.post<ApiResponse>(url, record, options).subscribe(
      response => {
        this.status = response.status;
        if(this.status == 1) {
          this.submitStatus = response.data as string;
        } else {
          this.submitStatus = response.data as string;
        }
      }
    );

    this.afterSubmit = true;
    this.id = undefined
    console.log("Submit status:",this.submitStatus);

  }
  closeStatus() {
    this.afterSubmit = false;
  }

  onStartDelRec() {
    this.deleteone = true;
    this.isAddingRecord = false;
    this.displayall = false;
    this.findone = false;
    this.displayone = false;
    this.afterSubmit = false;    
    this.displaydelete = false;
    this.isLogin = false;
    this.id = undefined
  }
  deleteRec() {
    var empId = this.id;
    if(empId != undefined && String(empId) != "") {
      var request = "https://localhost:5001/api/Employees/"+empId?.toString()
      this.http.delete<ApiResponse>(request).subscribe(
        response => {
          this.status = response.status;
          this.submitStatus = response.data as string;
        }
      );
    }
    else {
      this.submitStatus = "Emp Id cannot be empty."
      this.status = -1
    }
    this.displaydelete = true;
    this.id = undefined
  }
  closeDelete() {
    this.deleteone = false;
    this.displaydelete = false;
  }

  onStartLogin() {
    this.isLogin = true;
    this.isAddingRecord = false;
    this.displayall = false;
    this.findone = false;
    this.displayone = false;
    this.afterSubmit = false;
    this.deleteone = false;
    this.displaydelete = false;    
  }
  onEnterLogin(record: Record) {
    var empId = record.empId;
    var request = "https://localhost:5001/api/Employees/"+empId?.toString()
    this.http.get<ApiResponse>(request).subscribe(
      response => {
        this.status = response.status;
        if(this.status == 1) {
          this.emp = response.data as employee;
          this.router.navigate(["/login"]);
        } else {
          this.submitStatus = "Login Failed."+response.data as string;
          this.isLogin = false
          this.loginfail = true
        }
      }
    );
  }
  onCancelLogin() {
    this.isLogin = false;
  }
  closeLoginStatus() {
    this.loginfail = false;
  }

}
