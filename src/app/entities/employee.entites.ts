import { Data } from "@angular/router"
import { EmployeeRole } from "./employeeRole.entites"
import { EmployeeRolePostModel } from "./employeeRole.postModel"

export class Employee{
    id!:number
    identity!:string
    firstName!:string
    lastName!:string
    startDate!:Date
    dateOfBirth!:Date
    maleOrFmale!:boolean
    employeeRoles!:EmployeeRolePostModel[]
    status!:boolean
    companyId!:number
}