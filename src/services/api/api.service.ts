import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../session/session.service';
// import * as bcrypt from "bcrypt";


@Injectable({
  providedIn: 'root',
})

export class ApiService {
  // private apiUrl = 'https://time-backend-552bc6de8dc8.herokuapp.com';
  private apiUrl = 'http://localhost:5116';

  constructor(private http: HttpClient, private session: SessionService) { }

  // utility

  createHeader = (): { [key: string]: string } => {
    if (this.session.isLive()) {
      return {
        "Authorization": `Bearer ${this.session.getToken()}`
      }
    }
    return {};
  }

  // login/signup
  login(data: { [key: string]: string }): Observable<any> {

    // const hashedPassword = bcrypt.genSalt(10).then((salt) =>{
    //   return bcrypt.hash(data["Password"],salt);
    // })

    const body = { Username: data['Username'], Password: data["Password"] };
    return this.http.post(`${this.apiUrl}/auth/login`, body);
  }

  signup(data: { [key: string]: string }): Observable<any> {

    const body = {
      Password: data['Password'], Username: data['Username'], Email: data['Email Address'],
      FirstName: data["First Name"], LastName: data['Last Name']
    }

    return this.http.post(`${this.apiUrl}/signup`, body);
  }


  // projects

  createProject = (data: { [key: string]: string }): Observable<any> => {
    const body = {
      Name: data["Project Name"],
      UserId: data["UserId"],
      Budget: data["Budget"],
      StarDate: data["Start Date"],
      FinishDate: data["End Date"],
      ProjectHours: data["Alloted Hours"],
      Description: data["Project Description"]

    }

    // add the header here
    return this.http.post(`${this.apiUrl}/Project`, { body: body, headers: this.createHeader() });
  }

  // Projects

  getProjectsForUser = () => {
    return this.http.get(`${this.apiUrl}/Project`, { headers: this.createHeader() });

  }

  getProjectByID = (projectId: string) => {
    return this.http.get(`${this.apiUrl}/Project?projectId=${projectId}`, { headers: this.createHeader() });

  }

  // Project Departments

  getProjectDepartmentsForProject = (projectId: string) => {

    return this.http.get(`${this.apiUrl}/ProjectDepartment?projectId=${projectId}`, { headers: this.createHeader() });
  }

  updateProjectDepartment = (projectDepartmentQuery: { [key: string]: string }): Observable<any> => {
    return this.http.patch(`${this.apiUrl}/ProjectDepartment`, projectDepartmentQuery, { headers: this.createHeader() });
  }

  // Departments

  getDepartmentByID = (departmentId: string): Observable<any> => {
    return this.http.get(`${this.apiUrl}/Department?departmentId=${departmentId}`, { headers: this.createHeader() });
  }

  /**
   * Gets all the departments that are part of a company, based on that company id
   * 
   * @param companyId UUID-string representing the company.
   * @returns all the departments that are part of that company as a list in JSON format.
   */
  getDepartmentsByCompany = (companyId: string): Observable<any> => {
    return this.http.get(`${this.apiUrl}/Department?companyId=${companyId}`, { headers: this.createHeader() });
  }

  // Reconcile Project Departments

  createReconciledProject = (reconciledProject: { [key: string]: string }) => {
    return this.http.post(`${this.apiUrl}/ReconciledProject`, reconciledProject, { headers: this.createHeader() });
  }


  // Companies

  getCompanyById = (companyId: string) => {
    return this.http.get(`${this.apiUrl}/Company?companyId=${companyId}`, { headers: this.createHeader() });
  }

  // Time Blocks

  getTimeBlock = (startDate: string): Observable<any> => {
    return this.http.get(`${this.apiUrl}/TimeBlock?startTime=${startDate}`, { headers: this.createHeader() });

  }

  createTimeBlock = (body: { [key: string]: string | Date | null }): Observable<any> => {
    body["userId"] = this.session.getUserId();
    return this.http.post(`${this.apiUrl}/TimeBlock`, body, { headers: this.createHeader() });

  }


}
