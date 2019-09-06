using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;
using DatingApp.Api.Helpers;

namespace DatingApp.Api.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration  _config;
        private readonly IMapper _mapper;
        
        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _repo = repo;
            _config = config;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
          
            //converting the username to lower case because of duplication
            userForRegisterDto.Username= userForRegisterDto.Username.ToLower();

            //checking if the users already the exists
            if(await _repo.UserExists(userForRegisterDto.Username))
             return BadRequest("Username Already exixts");

            //creating the user in the database with the username
             var userToCreate = _mapper.Map<User>(userForRegisterDto);
           

            //passing the username and password input to the register method created in the repository
             var  createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

             //user to return
             var userToReturn = _mapper.Map<UserForDetailDto>(createdUser);

            // The CreatedAtRoute method is intended to return a URL to the newly created resource when you invoke a POST method to store some new object.
             return CreatedAtRoute("GetUser", new {controller ="Users", id = createdUser.Id}, userToReturn);
        }

         [HttpPost("login")]
         public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
         {
             //calling the login method in the authorization repository
             var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(),userForLoginDto.Password);
            
            //if the user is null
             if(userFromRepo == null)
              return Unauthorized();

            //The token contains two claims
            var claims = new[]
            {
                //This is claims for the ID..
                new Claim (ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),

                //This is claims for the Name..
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            //Creating a kry to ensure the token generated is secure
            var key = new SymmetricSecurityKey(Encoding.UTF8
            .GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            //The token description
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            //creating the token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            var user = _mapper.Map<UserForListDto>(userFromRepo);

            return Ok(new{
                token = tokenHandler.WriteToken(token),
                user
            });

         }
    }
}