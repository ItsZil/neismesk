using System.Net.Mail;
using System.Net;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace neismesk.Utilities
{
    public class Emailer
    {
        private Serilog.ILogger _logger;
        private string fromMail = "informacija.neismesk@gmail.com";
        private string fromPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD");
        private SmtpClient smtpClient;
        private MailMessage message;

        public Emailer()
        {
            CreateLogger();
            
            smtpClient = new SmtpClient();
            smtpClient.Port = 587;
            smtpClient.EnableSsl = true;
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential(fromMail, fromPassword);
            smtpClient.Host = "smtp.gmail.com";

            message = new MailMessage();
            message.From = new MailAddress(fromMail);
        }

        private void CreateLogger()
        {
            _logger = new LoggerConfiguration()
                .WriteTo.Console()
                .CreateLogger();
        }

        public async Task<bool> changePassword(DataTable result, string resetURL)
        {
            message.To.Add(new MailAddress(result.Rows[0]["email"].ToString()));
            message.Subject = "Pasikeiskite slaptažodį";
            message.Body = $"<html><body><p>Norėdami pasikeisti slaptažodį, spauskite <a href=\"{resetURL}\">čia</a>.</p></body></html>";
            message.IsBodyHtml = true;

            try
            {
                smtpClient.Send(message);
                return true;   
            }
            catch (Exception ex)
            {
                _logger.Error("Error sending email for password change: {0}", ex.Message);
                return false;
            }
        }

        public async Task<bool> verifyEmail(string email, string verifyURL)
        {
            message.To.Add(new MailAddress(email));
            message.Subject = "Patvirtinkite savo pašto adresą";
            message.Body = $"<html><body><p>Norėdami patvirtinti savo pašto adresą, spauskite <a href=\"{verifyURL}\">čia</a>.</p></body></html>";
            message.IsBodyHtml = true;

            try
            {
                smtpClient.Send(message);
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error("Error sending email for verification: {0}", ex.Message);
                return false;
            }
        }
    }
}
