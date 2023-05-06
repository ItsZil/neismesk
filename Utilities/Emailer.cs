using System.Net.Mail;
using System.Net;
using System.Data;

namespace neismesk.Utilities
{
    public class Emailer
    {
       private string fromMail = "informacija.neismesk@gmail.com";
       private string fromPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD");
       private SmtpClient smtpClient;

        public Emailer()
        {
            smtpClient = new SmtpClient();
            smtpClient.Port = 587;
            smtpClient.EnableSsl = true;
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential(fromMail, fromPassword);
            smtpClient.Host = "smtp.gmail.com";
        }

        public bool ChangePassword(DataTable result,string resetURL)
        {
            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromMail);
            message.To.Add(new MailAddress(result.Rows[0]["email"].ToString()));
            message.Subject = "Pasikeiskite slaptažodį";
            message.Body = $"<html><body><p>Norėdami pasikeisti slaptažodį, spauskite <a href=\"{resetURL}\">čia</a>.</p></body></html>";
            message.IsBodyHtml = true;

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

        public bool VerifyEmail(string email, string verifyURL)
        {
            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromMail);
            message.To.Add(new MailAddress(email));
            message.Subject = "Patvirtinkite savo pašto adresą";
            message.Body = $"<html><body><p>Norėdami patvirtinti savo pašto adresą, spauskite <a href=\"{verifyURL}\">čia</a>.</p></body></html>";
            message.IsBodyHtml = true;

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
