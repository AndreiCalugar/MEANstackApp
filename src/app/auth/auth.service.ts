import {Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import {Subject} from "rxjs";

@Injectable({providedIn: "root"})
export class AuthService{
    private token : string;
    private authStatusListener =new Subject<boolean>();//is user auth or not
    private isAuthenticated =false;
    constructor(private http: HttpClient){}

    getToken(){
        return this.token;
    }
    
    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    getIsAuth(){
        return this.isAuthenticated;
    }
    

    createUser(email:string,password:string){
        //create a new object based on the auth data model
      const authData : AuthData ={email : email, password : password};
        //send a post req using the httpclient
      this.http.post("http://localhost:3000/api/user/signup",authData)
        .subscribe(response => {
            console.log(response);
        });
    }

     login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token){
            this.isAuthenticated=true;
            this.authStatusListener.next(true);
        }      
      })
    }
   
    logout(){
        this.token=null;
        this.isAuthenticated=false;
        this.authStatusListener.next(false);
    }
}