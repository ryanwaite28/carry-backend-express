import { compile } from 'handlebars';
import { join } from 'path';
import { readFileSync } from 'fs';
import { AppEnvironment } from 'src/utils/app.enviornment';



export class HandlebarsEmailsService {

  public static readonly USERS = {
    welcome: {
      template: compile(readFileSync(join(__dirname, 'assets', 'email-templates', 'users', 'welcome.html'), 'utf8').toString()),
      subject: `Welcome to ${AppEnvironment.APP_NAME.DISPLAY}!`,
    },
    goodbye: {
      template: compile(readFileSync(join(__dirname, 'assets', 'email-templates', 'users', 'goodbye.html'), 'utf8').toString()),
      subject: `It was nice having you here at ${AppEnvironment.APP_NAME.DISPLAY}!`,
    },
    password_reset: {
      template: compile(readFileSync(join(__dirname, 'assets', 'email-templates', 'users', 'password_reset.html'), 'utf8').toString()),
      subject: `Password Reset`,
    },
  };

}