import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { NgForm } from '@angular/forms';
import { Role } from '../../models/role'; // Đường dẫn đến model Role
import { UserResponse } from '../../responses/user/user.response';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent extends BaseComponent implements OnInit{
  @ViewChild('loginForm') loginForm!: NgForm;  
    

  /*
  //Login user1
  phoneNumber: string = '33445566';
  password: string = '123456789';

  //Login user2
  phoneNumber: string = '0964896239';
  password: string = '123456789';


  //Login admin
  phoneNumber: string = '11223344';
  password: string = '11223344';

  */
  phoneNumber: string = '33445566';
  password: string = '123456789';
  showPassword: boolean = false;

  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }
  

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({      
      next: (apiResponse: ApiResponse) => { // Sử dụng kiểu Role[]
        debugger
        const roles = apiResponse.data
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      complete: () => {
        debugger
      },  
      error: (error: HttpErrorResponse) => {
        debugger;
        console.error(error?.error?.message ?? '');
      } 
    });
  }
  createAccount() {
    debugger
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']); 
  }
  login() {
    const message = `phone: ${this.phoneNumber}` +
      `password: ${this.password}`;
    //console.error(message);
    debugger

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };
    this.userService.login(loginDTO).subscribe({
      next: (apiResponse: ApiResponse) => {
        debugger;
        const { token } = apiResponse.data;
        this.tokenService.setToken(token);
        if (this.rememberMe) {                    
          debugger;
          this.userService.getUserDetail(token).subscribe({
            next: (apiResponse2: ApiResponse) => {
              debugger
              this.userResponse = {
                ...apiResponse2.data,
                date_of_birth: new Date(apiResponse2.data.date_of_birth),
              };    
              this.userService.saveUserResponseToLocalStorage(this.userResponse); 
              if(this.userResponse?.role.name == 'admin') {
                this.router.navigate(['/admin']);    
              } else if(this.userResponse?.role.name == 'user') {
                this.router.navigate(['/']);                      
              }
              
            },
            complete: () => {
              this.cartService.refreshCart();
              debugger;
            },
            error: (error: HttpErrorResponse) => {
              debugger;
              console.error(error?.error?.message ?? '');
            } 
          })
        }                        
      },
      complete: () => {
        debugger;
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        console.error(error?.error?.message ?? '');
      } 
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
