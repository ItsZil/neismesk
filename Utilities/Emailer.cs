using System.Net.Mail;
using System.Net;
using System.Data;

namespace neismesk.Utilities
{
    public class Emailer
    {
       private string fromMail = "informacija.neismesk@gmail.com";
       private string fromPassword = "mobicqvvjspdffff";

        public bool ChangePassword(DataTable result,string resetURL)
        {
            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromMail);
            message.To.Add(new MailAddress(result.Rows[0]["email"].ToString()));
            message.Subject = "Pasikeiskite slaptažodį";
            message.Body = $"<html><body><p>Norėdami pasikeisti slaptažodį, spauskite <a href=\"{resetURL}\">čia</a>.</p></body></html>";
            message.IsBodyHtml = true;

            SmtpClient smtpClient = new SmtpClient();
            smtpClient.Port = 587;
            smtpClient.EnableSsl = true;
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential(fromMail, fromPassword);
            smtpClient.Host = "smtp.gmail.com";

            try
            {
                smtpClient.Send(message);
                // Email was sent successfully
                return true;
            }
            catch (Exception ex)
            {
                // There was an error sending the email
                return false;
            }
        }
    }
}
