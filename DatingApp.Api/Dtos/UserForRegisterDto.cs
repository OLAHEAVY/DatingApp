using System.ComponentModel.DataAnnotations;

namespace DatingApp.Api.Dtos
{
    //This is a data transfer object for the register method
    public class UserForRegisterDto
    {
        [Required]
        public string Username{get; set;}

        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage="You must specify passwords between 4 and 8 characters")]
        public string Password{get;set;}
    }
}