using System.Linq;
using AutoMapper;
using DatingApp.Api.Dtos;
using DatingApp.Api.Model;

namespace DatingApp.Api.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            //mapping is done from source to destination

            //returning the users on the list page
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl, opt =>{
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);     
                })
                .ForMember(dest => dest.Age, opt =>{
                    opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());  
                });

            //returning the users on the detail page
            CreateMap<User, UserForDetailDto>()
                .ForMember(dest => dest.PhotoUrl, opt =>{
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);     
                })
                .ForMember(dest => dest.Age, opt =>{
                    opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());  
                });

            //returning the photo on the detail page
            CreateMap<Photo, PhotosForDetailDto>();

            //updating the profile of the users
            CreateMap<UserForUpdateDto, User>();

            //dto for the response from the cloudinary API
            CreateMap<Photo, PhotoForReturnDto>();

            //dto for uploading the photo
            CreateMap<PhotoForCreationDto, Photo>();

        }
    }
}