import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request:any) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required fields' },
        { status: 400 }
      );
    }

    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Create the nodemailer transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Recipient email addresses - update these to the relevant Green USEK contacts
    const recipients = ['green@usek.edu.lb','dalidasneifer@usek.edu.lb'];

    // Format subject line
    const emailSubject = subject
      ? `Green USEK Contact: ${subject}`
      : 'New Contact Form Submission - Green USEK';

    // Prepare the email content with both plain text and HTML versions
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: emailSubject,
      text: `New Contact Form Submission:
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject || 'Not specified'}
Message: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2F855A; border-bottom: 2px solid #2F855A; padding-bottom: 10px;">Green USEK - New Contact Form Submission</h2>

          <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Name:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Phone:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Subject:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${subject || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Message:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>

          <p style="color: #666; font-size: 14px; margin-top: 20px;">This email was sent from the Green USEK website contact form.</p>
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return a successful JSON response
    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}