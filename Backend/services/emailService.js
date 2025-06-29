const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const templates = {

 issueConfirmation: (student, books, dueDate) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #2563eb; padding: 20px; color: white;">
      <h1 style="margin: 0;">Book Issuance Confirmation</h1>
    </div>

    <div style="padding: 20px;">
      <p>Dear ${student.name},</p>
      <p>The following books have been issued to you from HNBGU Library:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="padding: 12px; border: 1px solid #e2e8f0;">Accession No.</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">Book Title</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">Author</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${books.map(book => `
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">${book.accessionNumber}</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">${book.bookName}</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">${book.authorName}</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">${new Date(dueDate).toLocaleDateString("en-GB")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626;">
        <p style="margin: 0; color: #dc2626; font-weight: 500;">
          Please return the books by the due date to avoid late fees.
        </p>
      </div>

      <p style="margin-top: 25px;">Thank you for using our library services!</p>
    </div>

    <div style="background-color: #f8fafc; padding: 15px; text-align: center; color: #64748b; font-size: 14px;">
      <p style="margin: 0;">HNBGU Central Library &copy; ${new Date().getFullYear()}</p>
    </div>
  </div>
`
,
  returnConfirmation: (student, books, fineDetails) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #10b981; padding: 20px; color: white;">
        <h1 style="margin: 0;">Book Return Confirmation</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Dear ${student.name},</p>
        <p>Thank you for returning the following books to HNBGU Library:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Book Title</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Author</th>
            </tr>
          </thead>
          <tbody>
            ${books.map(book => `
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${book.bookName}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${book.authorName}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${fineDetails?.isLate ? `
          <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <p style="margin: 0; color: #dc2626; font-weight: 500;">
              Note: This book was returned <strong>after the due date</strong>. Please return books on time to avoid issues in future.
            </p>
          </div>
        ` : ''}
        
        <p style="margin-top: 25px;">We appreciate you returning the books!</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 15px; text-align: center; color: #64748b; font-size: 14px;">
        <p style="margin: 0;">HNBGU Central Library &copy; ${new Date().getFullYear()}</p>
      </div>
    </div>
  `,

  dueDateReminder: (student, books) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #f59e0b; padding: 20px; color: white;">
      <h1 style="margin: 0;">Book Due Date Reminder</h1>
    </div>
    
    <div style="padding: 20px;">
      <p>Dear ${student.name},</p>
      <p>The following books from HNBGU Library are due soon:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Book Title</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Author</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${books.map(book => `
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">${book.bookName}</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">${book.authorName}</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">${new Date(book.dueDate).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; margin-top: 20px;">
        <p style="margin: 0; color: #dc2626; font-weight: 500;">
          Please return these books by their due dates to avoid late fees.
        </p>
      </div>
      
      <p style="margin-top: 25px;">Thank you for using our library services!</p>
    </div>
    
    <div style="background-color: #f8fafc; padding: 15px; text-align: center; color: #64748b; font-size: 14px;">
      <p style="margin: 0;">HNBGU Central Library &copy; ${new Date().getFullYear()}</p>
    </div>
  </div>
`,
};

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"HNBGU Library" <${process.env.EMAIL_USER}>`,
      to: options.recipient,
      subject: options.subject,
      html: options.template,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.recipient}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};


module.exports = {
  sendIssueConfirmation: async (student, books, dueDate) => {
    const success = await sendEmail({
      recipient: student.email,
      subject: `Book Issuance Confirmation - ${books.length} Book(s) Issued`,
      template: templates.issueConfirmation(student, books, dueDate)
    });

    if (!success) {
      console.error(`Failed to send issue confirmation to ${student.email}`);
    }
  },

  sendReturnConfirmation: async (student, books, fineDetails = null) => {
    const success = await sendEmail({
      recipient: student.email,
      subject: `Book Return Confirmation - ${books.length} Book(s) Returned`,
      template: templates.returnConfirmation(student, books, fineDetails)
    });

    if (!success) {
      console.error(`Failed to send return confirmation to ${student.email}`);
    }
  },

  sendDueDateReminder: async (student, books) => {
    const success = await sendEmail({
      recipient: student.email,
      subject: `Due Date Reminder - ${books.length} Book(s) Due Soon`,
      template: templates.dueDateReminder(student, books)
    });

    if (!success) {
      console.error(`Failed to send due date reminder to ${student.email}`);
    }
  }
};
