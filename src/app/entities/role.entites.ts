import { EmployeeRole } from "./employeeRole.entites"

export class Role {
    roleId!: number
    roleName!: string
    // isManagementRole!: boolean
    employeeRoles!: EmployeeRole[]
}