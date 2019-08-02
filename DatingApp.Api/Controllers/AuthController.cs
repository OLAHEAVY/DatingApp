using System.Threading.Tasks;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Model;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        public AuthController(IAuthRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            //validate the request

            //converting the username to lower case because of duplication
            userForRegisterDto.Username= userForRegisterDto.Username.ToLower();

            //checking if the users already the exists
            if(await _repo.UserExists(userForRegisterDto.Username))
             return BadRequest("Username Already exixts");

            //creating the user in the database with the username
             var userToCreate = new User 
             {
                 Username = userForRegisterDto.Username
             };

            //passing the username and password input to the register method created in the repository
             var  createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            // The CreatedAtRoute method is intended to return a URI to the newly created resource when you invoke a POST method to store some new object.
             return StatusCode(201);
        }
    }
}