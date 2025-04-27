using System.Data;
using API.Data;
using API.Entities;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;


namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private IDbConnection connection;
        public EmployeesController(DBContext context) => connection = context.CreateConnection();

        [HttpGet]
        public async Task<JsonResult>GetEmployees()
        {
            var emplist = await connection.QueryAsync<Employee>("Exec Allemp");
            if(emplist != null) 
            {
                return new JsonResult(new { data = emplist.ToList(), status = 1});
            } else {
                return new JsonResult(new { data = "Resource not found", status = 0 });
            }     
        }

        [HttpGet("{id:int}")]
        public async Task<JsonResult> GetEmployee(int id) 
        {
            var emp = await connection.QueryFirstOrDefaultAsync<Employee>($"Exec GetEmp @EmpId={id}");
            if(emp != null)
            {
                return new JsonResult(new { data = emp, status = 1});
            } else {
                return new JsonResult(new { data = "No Employee found with the given ID", status = 0 });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<JsonResult> DeleteEmployee(int id) 
        {
            var emp = await connection.QueryFirstOrDefaultAsync<Employee>($"Exec GetEmp @EmpId={id}");
            if(emp != null)
            {
                await connection.ExecuteAsync($"Exec DelEmp @EmpId={id}");
                return new JsonResult(new { data = "Employee record with given ID deleted", status = 1 });
            } 
            else {
                return new JsonResult(new { data = "No Employee found with the given ID", status = 0 });
            }
        }

        [HttpPost]
        public async Task<JsonResult> CreateEmployee(Employee employee) 
        {
            var parameters = new DynamicParameters();
            parameters.Add("id", employee.EmpId, DbType.Int32);
            parameters.Add("name", employee.EmpName, DbType.String);
            
            var error = "";
            try
            {
                await connection.ExecuteAsync($"Exec AddEmp @id, @name", parameters);    
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                error = ex.Message;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                error = ex.Message;
            }

            if(error == "")
            {
                return new JsonResult(new { data = "Record inserted successfully.", status = 1 });
            } else {
                return new JsonResult(new { data = "Record insertion unsuccessful. "+error, status = 0 });
            }
        }
    }
}