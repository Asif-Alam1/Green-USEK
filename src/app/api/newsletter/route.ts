import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // Extract email from request body
    const { email } = await request.json();

    // Validate email is provided
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
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

    // Recipient email addresses
    const recipients = ['green@usek.edu.lb', 'dalidasneifer@usek.edu.lb'];

    // Current date for the email
    const date = new Date().toLocaleString();

    // Prepare the email content with both plain text and HTML versions
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: 'New Newsletter Subscription - Green USEK',
      text: `New Newsletter Subscription:
Email: ${email}
Date: ${date}

This email was sent from the Green USEK website newsletter subscription form.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2F855A; border-bottom: 2px solid #2F855A; padding-bottom: 10px;">Green USEK - New Newsletter Subscription</h2>

          <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Date:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
            </tr>
          </table>

          <p style="color: #666; font-size: 14px; margin-top: 20px;">This email was sent from the Green USEK website newsletter subscription form.</p>
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return a successful JSON response
    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    });
  } catch (error) {
    console.error('Error sending newsletter subscription email:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to subscribe to newsletter',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}