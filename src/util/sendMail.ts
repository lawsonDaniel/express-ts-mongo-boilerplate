import axios from "axios";
import { API_KEY } from "./config";

console.log("API_KEY:", API_KEY); // Debugging line to check if API_KEY is loaded correctly
export async function sendEmail(recipientEmail: string, subject: string, message: string) {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: { email: "lawblaze4@gmail.com" },
                to: [{ email: recipientEmail }],
                subject: subject,
                htmlContent: message,
            },
            {
                headers: {
                    "api-key": API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("Email sent:", response.data);
    } catch (error: any) {
        console.error("Error sending email:", error.response?.data || error.message);
        throw new Error(`Failed to send email: ${error.response?.data?.message || error.message}`);
    }
}

// Example usage
// sendEmail("customerservicereplysystem@gmail.com", "Hello World", "<p>Congrats on sending your <strong>first email</strong>!</p>");