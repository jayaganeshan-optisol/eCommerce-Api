import nodemailer from "nodemailer";
import config from "config";
import fs from "fs";
import handlebars from "handlebars";
export async function mail(name: string, email: string, subject: string, text: string) {
  try {
    // create reusable transporter object using the default SMTP transport
    const source = fs.readFileSync(__dirname + "/helpers/template/reset-password.handlebars", {
      encoding: "utf-8",
    });
    console.log(__dirname + "/helpers/template/reset-password.handlebars");
    const compiledTemplate = handlebars.compile(source);
    const htmlToSent = compiledTemplate({
      name: name,
      link: text,
    });

    let transporter = nodemailer.createTransport({
      service: "fastmail", // true for 465, false for other ports
      auth: {
        user: config.get("NODEMAILER_USER"), // generated ethereal user
        pass: config.get("NODEMAILER_PASS"), // generated ethereal password
      },
    });
    console.log(htmlToSent);
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"E-Commerce" <${config.get("NODEMAILER_USER")}>`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: htmlToSent, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (er) {
    console.log(er);
  } finally {
    console.log("done");
  }
}
