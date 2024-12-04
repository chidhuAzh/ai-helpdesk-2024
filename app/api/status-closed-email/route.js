import { createTransport } from 'nodemailer';

export async function POST(request) {
  const body = await request.json();
  console.log("ddd4564",body);
  
  // Configure your email transport
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
      }
  });
  
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.to,
      subject: body.subject,
      html: `
        <h2>Your Ticket has been Closed </h2>
        <p>If you need any assistance, please reach out to the IT team.</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 