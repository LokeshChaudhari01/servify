export async function sendEmail({
  to,
  toName,
  subject,
  htmlContent,
}: {
  to: string;
  toName: string;
  subject: string;
  htmlContent: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@servify.com";

  if (!apiKey) {
    console.warn("BREVO_API_KEY is not configured. Email will not be sent.");
    return false;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "Servify",
          email: senderEmail,
        },
        to: [
          {
            email: to,
            name: toName,
          },
        ],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo Email Error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
