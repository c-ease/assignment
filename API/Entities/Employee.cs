using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class Employee
{
    [Key]
    public int EmpId { get; set; }       
    public required string EmpName { get; set; }
}
