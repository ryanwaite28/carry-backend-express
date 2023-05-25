import { compile } from 'handlebars';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { AppEnvironment } from 'src/utils/app.enviornment';



const get_html_file_as_string = (construct: string, filename: string) => {
  const html_file_path = join(__dirname, 'assets', 'email-templates', construct, filename);
  const fileExists = existsSync(html_file_path);
  console.log(`html_file_path:`, { html_file_path, fileExists });
  if (!fileExists) {
    console.log(`File does not exist...`);
  }
  const content = readFileSync(html_file_path, 'utf8').toString();
  return content;
}

export class HandlebarsEmailsService {

  public static readonly USERS = {
    welcome: {
      subject: `Welcome to ${AppEnvironment.APP_NAME.DISPLAY}!`,
      template: compile(get_html_file_as_string('users', 'welcome.html')),
    },
    goodbye: {
      subject: `It was nice having you here at ${AppEnvironment.APP_NAME.DISPLAY}!`,
      template: compile(get_html_file_as_string('users', 'goodbye.html')),
    },
    password_reset: {
      subject: `Password Reset`,
      template: compile(get_html_file_as_string('users', 'password_reset.html')),
    },
  };

}