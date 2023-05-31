import { compile } from 'handlebars';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { AppEnvironment } from 'src/utils/app.enviornment';



const get_html_file_as_string = (construct: string, filename: string) => {
  let html_file_path = join(__dirname, 'assets', 'email-templates', construct, filename);
  let fileExists = existsSync(html_file_path);
  console.log(`html_file_path:`, { html_file_path, fileExists });
  if (!fileExists) {
    console.log(`File does not exist, trying parent directory...`);
    html_file_path = join(__dirname, '../', 'assets', 'email-templates', construct, filename);
    fileExists = existsSync(html_file_path);

    console.log(`html_file_path:`, { html_file_path, fileExists });
    if (!fileExists) {
      console.log(`File does not exist...`);
    }
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
      subject: `${AppEnvironment.APP_NAME.DISPLAY} - Password Reset`,
      template: compile(get_html_file_as_string('users', 'password_reset.html')),
    },
    password_reset_success: {
      subject: `${AppEnvironment.APP_NAME.DISPLAY} - Password Reset Successful`,
      template: compile(get_html_file_as_string('users', 'password_reset_success.html')),
    },

    customer_unpaid_listing: {
      subject: (delivery_title: string) => `${AppEnvironment.APP_NAME.DISPLAY} - Unpaid delivery listing: ${delivery_title}`,
      template: compile(get_html_file_as_string('users', 'customer_unpaid_listing.html')),
    },
  };

}
