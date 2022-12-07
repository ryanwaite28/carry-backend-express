import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const aws_ses_client = new SESClient({ region: "us-east-1" });



export function sendAwsEmail(params: {
  to: string,
  subject: string,
  message: string,
}) {
  return aws_ses_client.send(new SendEmailCommand({
    Source: process.env.PLATFORM_AWS_SES_EMAIL,
    Destination: {
      ToAddresses: [params.to]
    },
    Message: {
      Subject: {
        Data: params.subject,
      },
      Body: {
        Html: {
          Data: params.message
        }
      }
    },
    ReplyToAddresses: [process.env.PLATFORM_AWS_SES_EMAIL],
    SourceArn: process.env.PLATFORM_AWS_SES_ARN
  }))
}