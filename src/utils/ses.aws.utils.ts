import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { AppEnvironment } from "./app.enviornment";
const aws_ses_client = new SESClient({ region: "us-east-1" });



export function sendAwsEmail(params: {
  to: string,
  subject: string,
  message?: string,
  html?: string,
}) {
  const sendCommandParams: SendEmailCommandInput = {
    Source: AppEnvironment.AWS.SES.EMAIL,
    Destination: {
      ToAddresses: [params.to]
    },
    Message: {
      Subject: {
        Data: params.subject,
        Charset: `utf-8`
      },
      // if both are defined, html takes priority over message
      Body: !!params.html
        ? { Html: { Data: params.html, Charset: `utf-8` } }
        : { Text: { Data: params.message, Charset: `utf-8` } }
    },
    ReplyToAddresses: [],
    SourceArn: AppEnvironment.AWS.SES.ARN
  };
  console.log(`Sending email via AWS SES:`, params, sendCommandParams);
  const command = new SendEmailCommand(sendCommandParams);
  return aws_ses_client.send(command)
    .then((results) => {
      console.log(`Email AWS SES send results:`, results);
      return results;
    })
    .catch((error) => {
      console.log(`Email AWS SES send error:`, error);
      return error;
    });
}