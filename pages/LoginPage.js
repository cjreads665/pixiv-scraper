import BasePage from "./BasePage";

export default class LoginPage extends BasePage{
    constructor(page){
        this.page = page
        this.emailField = 'input[type="text"]'
        this.passwordField = 'input[type="password"]'
        this.submitBtn = ''
    }



    async login(email,password){

    }


}