import mailjet from 'node-mailjet';

export function send_email(params: {
  to: string,
  name: string,
  subject: string,
  html: string
}) {
  return new Promise((resolve, reject) => {
    const { to, name, subject, html } = params;
    if (!to) {
      console.log(`TO ADDRESS REQUIRED...`);
      return reject();
    }
    if (!name) {
      console.log(`NAME REQUIRED...`);
      return reject();
    }
    if (!subject) {
      console.log(`SUBJECT REQUIRED...`);
      return reject();
    }
    if (!html) {
      console.log(`BODY MESSAGE REQUIRED...`);
      return reject();
    }

    if (!process.env.MAILJET_API_KEY) {
      console.log(`MAILJET_API_KEY REQUIRED...`);
      return reject();
    }
    if (!process.env.MAILJET_API_SECRET) {
      console.log(`MAILJET_API_SECRET REQUIRED...`);
      return reject();
    }
    if (!process.env.MAILJET_CLIENT_EMAIL) {
      console.log(`MAILJET_CLIENT_EMAIL REQUIRED...`);
      return reject();
    }
    if (!process.env.MAILJET_CLIENT_NAME) {
      console.log(`MAILJET_CLIENT_NAME REQUIRED...`);
      return reject();
    }

    try {
      const mailjet_client = (<any> mailjet).connect(
        process.env.MAILJET_API_KEY,
        process.env.MAILJET_API_SECRET
      );
      
      mailjet_client
        .post(`send`, { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_CLIENT_EMAIL,
                Name: process.env.MAILJET_CLIENT_NAME
              },
              To: [
                {
                  Email: to,
                  Name: name
                }
              ],
              Subject: subject,
              TextPart: subject,
              HTMLPart: html
              // CustomID: ""
            }
          ]
        })
        .then(results => {
          resolve(results);
        })
        .catch(error => {
          reject(error);
        });
    } catch (e) {
      console.log(`ERROR SENDING EMAIL...`, e);
      return reject(e);
    }
  });
}