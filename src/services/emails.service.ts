import { compile } from 'handlebars';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { AppEnvironment } from 'src/utils/app.enviornment';
import { sendAwsEmail } from 'src/utils/ses.aws.utils';
import { getUserFullName } from 'src/utils/helpers.utils';
import { IUser } from 'src/interfaces/carry.interface';
import { LOGGER } from 'src/utils/logger.utils';



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

  // Configs

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

    identity_verification_session_canceled: {
      subject: `${AppEnvironment.APP_NAME.DISPLAY} - Identity Verification Session Canceled`,
      template: compile(get_html_file_as_string('users', 'identity_verification_session_canceled.html')),
    },
    identity_verification_session_verified: {
      subject: `${AppEnvironment.APP_NAME.DISPLAY} - Identity Verified`,
      template: compile(get_html_file_as_string('users', 'identity_verification_session_verified.html')),
    },

    customer_unpaid_listing: {
      subject: (delivery_title: string) => `${AppEnvironment.APP_NAME.DISPLAY} - Unpaid delivery listing: ${delivery_title}`,
      template: compile(get_html_file_as_string('users', 'customer_unpaid_listing.html')),
    },
  };

  public static readonly INTERNAL = {
    new_delivery_dispute: {
      subject: (dispute_title: string) => `${AppEnvironment.APP_NAME.DISPLAY} - New Delivery Dispute Opened: ${dispute_title}`,
      template: compile(get_html_file_as_string('internal', 'new_delivery_dispute.html')),
    },
  };



  // Helpers

  static send_identity_verification_session_canceled(user: IUser) {
    return sendAwsEmail({
      to: user.email,
      subject: HandlebarsEmailsService.USERS.identity_verification_session_canceled.subject,
      html: HandlebarsEmailsService.USERS.identity_verification_session_canceled.template({
        user_name: getUserFullName(user),
        app_name: AppEnvironment.APP_NAME.DISPLAY
      })
    })
    .then((results) => {
      LOGGER.info(`Sent identity verification session canceled email.`);
    })
    .catch((error) => {
      LOGGER.error(`Could not send identity verification session canceled email...`);
    });
  }

  static send_identity_verification_session_verified(user: IUser) {
    return sendAwsEmail({
      to: user.email,
      subject: HandlebarsEmailsService.USERS.identity_verification_session_verified.subject,
      html: HandlebarsEmailsService.USERS.identity_verification_session_verified.template({
        user_name: getUserFullName(user),
        app_name: AppEnvironment.APP_NAME.DISPLAY
      })
    })
    .then((results) => {
      LOGGER.info(`Sent identity verification session verified email.`);
    })
    .catch((error) => {
      LOGGER.error(`Could not send identity verification session verified email...`);
    });
  }

}
