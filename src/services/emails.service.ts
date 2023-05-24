import { compile } from 'handlebars';
import { resolve } from 'path';
import { AppEnvironment } from 'src/utils/app.enviornment';



export class HandlebarsEmailsService {

  public static readonly USERS = {
    welcome: {
      template: compile(resolve(__dirname, 'email-templates', 'users', 'welcome.html')),
      subject: `Welcome to ${AppEnvironment.APP_NAME.DISPLAY}!`,
    },
    goodbye: {
      template: compile(resolve(__dirname, 'email-templates', 'users', 'goodbye.html')),
      subject: `It was nice having you here at ${AppEnvironment.APP_NAME.DISPLAY}!`,
    },
    password_reset: {
      template: compile(resolve(__dirname, 'email-templates', 'users', 'password_reset.html')),
      subject: `Password Reset`,
    },
  };

}