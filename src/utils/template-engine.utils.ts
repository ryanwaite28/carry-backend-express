
import * as nunjucks from 'nunjucks';
import * as path from 'path';

const htmlPath = path.join(__dirname, '../_public/static/html');
export function installExpressApp(app: Express.Application) {
  nunjucks.configure(htmlPath, {
    autoescape: true,
    express: app
  });
}

/* --- Emails --- */

export function SignedUp_EMAIL(data: { [key: string]: any; }) {
  return nunjucks.render('email/SignedUp.html', { data });
}

export function ContactUser_EMAIL(data: { [key: string]: any; }) {
  return nunjucks.render('email/ContactUser.html', { data });
}

export function VerifyEmail_EMAIL(data: { [key: string]: any; }) {
  return nunjucks.render('email/VerifyEmail.html', { data });
}

export function PasswordReset_EMAIL(data: { [key: string]: any; }) {
  return nunjucks.render('email/PasswordReset.html', { data });
}

export function PasswordResetSuccess_EMAIL(data: { [key: string]: any; }) {
  return nunjucks.render('email/PasswordResetSuccess.html', { data });
}
