import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  // this is a child component to the member-edit page
  @Input() photos: Photo[];

  // emitting this variable to the parent component => member-edit
  @Output() getMemberPhotoChange = new EventEmitter<string>();

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;
  constructor(private authService: AuthService,
              private userService: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializerUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializerUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken : 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    // this was added to checkmate the error of access headers
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };
    // this was added to ensure that the pictures show once it is uploaded
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id : res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain : res.isMain
        };

        this.photos.push(photo);
        // to ensure  a new user uploads a main photo
        if (photo.isMain) {
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
      }
    };
  }

  // method to set the main photo
  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      // array filter to make sure that the  main picture displays immediately
      this.currentMain = this.photos.filter (p => p.isMain === true)[0];
      this.currentMain.isMain  = false;
      photo.isMain = true;
      // emitting the photo url to the parent component
      // this.getMemberPhotoChange.emit(photo.url);
      this.authService.changeMemberPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    }, error => {
      this.alertify.error(error);
    });
  }

  // method to delete the photo
  deletePhoto(id: number) {
    this.alertify.confirm('Are you sure you want to delete the photo?', () => {
    this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(() => {
       this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
       this.alertify.success('Photo has been deleted');
    }, error => {
      this.alertify.error('Failed to the Delete Photo');
    });

  });
  }

}
