import * as nodemailer from "nodemailer";

export class NodeMailerSendEmail {
    public clientUrl: string = "https://beta.brocenligne.fr"
    public mailApp: string = "no-reply@brocenligne.fr";

    public transporter = nodemailer.createTransport({
        host: "mail.infomaniak.com",
        port: 465,
        secure: true,
        auth: {
            user: this.mailApp,
            pass: "L!9D--V9m7e-fv"
        },
        tls: {
            rejectUnauthorized: false // ne pas vérifier le certificat du serveur SMTP
        }
    });

    public async sendMailRegister(email: string, subject: string, username: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
                    <head>
                        <style>
                        </style>
                    </head>
                    <body>
                        <p>Bonjour ${username},</p>
                        <p>Nous sommes ravis de vous annoncer que votre compte Broc en ligne a bien été créé ! Vous pouvez dès maintenant accéder à notre plateforme et découvrir toutes les brocantes de France et les articles de leurs exposants.</p>
                        <br>
                        <p>Pour commencer à naviguer sur Broc en ligne, veuillez cliquer sur le lien ci-dessous pour être redirigé sur notre site :</p>
                        <a href="${this.clientUrl}">Lien vers le site</a>
                        <br>
                        <br>
                        <p>Si vous n'êtes pas à l'origine de cette action, veuillez contacter notre support pour signaler toute activité suspecte.</p>
                        <a href="${this.clientUrl}/contact">Lien vers la page contact</a>
                        <br>
                        <br>
                        <p>Nous espérons que vous apprécierez votre expérience sur Broc en ligne. N'hésitez pas à nous contacter si vous avez des questions ou des commentaires.</p>
                        <br>
                        <p>Cordialement,</p>
                        <p>L'équipe Broc en ligne</p>
                    </body>
                    </html>`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailRemoveUser(email: string, subject: string, username: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
                    <head>
                        <style>
                        </style>
                    </head>
                    <body>
                        <p>Bonjour ${username},</p>
                        <p>Nous avons bien reçu votre demande de suppression de votre compte Broc en ligne et nous vous confirmons que votre compte a bien été supprimé de notre plateforme.</p>
                        <br>
                        <p>Nous sommes désolés de vous voir partir. Nous espérons que vous avez trouvé ce que vous cherchiez sur notre plateforme et que vous reviendrez nous voir.</p>
                        <br>
                        <p>Si vous n'êtes pas à l'origine de cette action, veuillez contacter notre support pour signaler toute activité suspecte.</p>
                        <a href="${this.clientUrl}/contact">Lien vers la page contact</a>
                        <br>
                        <br>
                        <p>Nous vous remercions pour votre confiance et nous espérons avoir le plaisir de vous revoir bientôt sur Broc en ligne.</p>
                        <br>
                        <p>Cordialement,</p>
                        <p>L'équipe Broc en ligne</p>
                    </body>
                    </html>`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailForgotPassword(email: string, subject: string, username: string, link: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
                    <head>
                        <style>
                        </style>
                    </head>
                    <body>
                        <p>Bonjour ${username},</p>
                        <p>Vous avez demandé à réinitialiser votre mot de passe pour accéder à votre compte Broc en ligne.</p>
                        <br>
                        <p>Pour continuer le processus de réinitialisation, veuillez cliquer sur le lien ci-dessous pour être redirigé vers notre plateforme afin de modifier votre mot de passe :</p>
                        <a href="${this.clientUrl}/${link}">Réinitialiser le mot de passe</a>
                        <br>
                        <br>
                        <p>Si vous n'êtes pas à l'origine de cette action, veuillez contacter notre support pour signaler toute activité suspecte.</p>
                        <a href="${this.clientUrl}/contact">Lien vers la page contact</a>
                        <br>
                        <br>
                        <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter.</p>
                        <br>
                        <p>Cordialement,</p>
                        <p>L'équipe Broc en ligne</p>
                    </body>
                    </html>`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailConfirmResetPassword(email: string, subject: string, username: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
                    <head>
                        <style>
                        </style>
                    </head>
                    <body>
                        <p>Bonjour ${username},</p>
                        <p>Nous vous confirmons que votre mot de passe Broc en ligne a bien été réinitialisé.</p>
                        <p>Nous souhaitons vous rappeler qu’il ne faut pas partager votre mot de passe avec qui que ce soit.</p>
                        <br>
                        <p>Pour vous connecter à votre compte avec votre nouveau mot de passe, veuillez cliquer sur le lien ci-dessous pour être redirigé vers notre plateforme :</p>
                        <a href="${this.clientUrl}">Lien vers le site</a>
                        <br>
                        <br>
                        <p>Si vous n'êtes pas à l'origine de cette action, veuillez contacter notre support pour signaler toute activité suspecte.</p>
                        <a href="${this.clientUrl}/contact">Lien vers la page contact</a>
                        <br>
                        <br>
                        <p>Si vous avez des questions ou des commentaires, n'hésitez pas à nous contacter.</p>
                        <br>
                        <p>Cordialement,</p>
                        <p>L'équipe Broc en ligne</p>
                    </body>
                    </html>`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailConfirmUpdatePassword(email: string, subject: string, username: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
                    <head>
                        <style>
                        </style>
                    </head>
                    <body>
                        <p>Bonjour ${username},</p>
                        <p>Nous vous confirmons que le mot de passe de votre compte Broc en ligne a bien été modifié.</p>
                        <p>Pour des raisons de sécurité, nous souhaitons vous rappeler qu’il ne faut pas le partager avec qui que ce soit..</p>
                        <br>
                        <p>Si vous n'êtes pas à l'origine de cette action, veuillez contacter notre support pour signaler toute activité suspecte.</p>
                        <a href="${this.clientUrl}/contact">Lien vers la page contact</a>
                        <br>
                        <br>
                        <p>Si vous avez des questions ou des commentaires, n'hésitez pas à nous contacter.</p>
                        <br>
                        <p>Cordialement,</p>
                        <p>L'équipe Broc en ligne</p>
                    </body>
                    </html>`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailConfirmReservationSeller(email: string, subject: string, usernameSeller: string,
        articleName: string, usernameBuyer: string, mailBuyer: string, phoneBuyer: string, marketName: string, localisation: string, delivery_hour: string, marketDate: string, emplacement: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
                    <head>
                        <style>
                        </style>
                    </head>
                    <body>
                        <p>Bonjour ${usernameSeller},</p><br>
                        <p>Nous sommes ravis de vous informer que votre article ${articleName} a été réservé par un utilisateur sur Broc en ligne.</p><br>

                        <p>Pour procéder à la transaction de votre article, voici les informations dont vous aurez besoin : </p><br>

                        <p>Article réservé : ${articleName}</p>
                        <p>Pseudo de l'utilisateur : ${usernameBuyer}</p>
                        <p>Email de l'utilisateur : ${mailBuyer}</p>
                        <p>Numéro de téléphone de l'utilisateur : ${phoneBuyer}</p>
                        <p>Brocante : ${marketName}</p>
                        <p>Lieu : ${localisation}</p>
                        <p>Date et heure de la réservation : ${marketDate} entre ${delivery_hour}</p><br>
                        <p>Emplacement dans la brocante : ${emplacement}</p><br>

                        <p>Nous vous encourageons à contacter l'utilisateur pour organiser les détails de la transaction et de la récupération de l'article <strong>ainsi que communiquer le plan d'emplacement.</strong></p>
                        <p>Nous vous rappelons que Broc en ligne ne gère pas cette étape entre les utilisateurs et les exposants.</p>

                        <br>
                        <p>Cordialement,</p>
                        <p>L'équipe Broc en ligne</p>
                    </body>
                    </html>`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailConfirmReservationBuyer(email: string, subject: string, usernameSeller: string,
        articleName: string, usernameBuyer: string, mailSeller: string, phoneSeller: string, marketName: string, localisation: string, delivery_hour: string, marketDate: string, emplacement: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
                    <head>
                        <style>
                        </style>
                    </head>
                    <body>
                        <p>Bonjour ${usernameBuyer},</p><br>
                        <p>Nous sommes heureux de vous confirmer votre réservation pour l'article suivant : ${articleName}.</p>

                        <p>Voici toutes les informations dont vous aurez besoin pour procéder à l’achat de votre article en brocante :</p>

                        <p>Article réservé : ${articleName}</p>
                        <p>Exposant de l'article : ${usernameSeller} : ${mailSeller}, ${phoneSeller}</p>
                        <p>Brocante : ${marketName}</p>
                        <p>Lieu : ${localisation}</p>
                        <p>Date et heure de la réservation : ${marketDate} entre ${delivery_hour}</p>
                        <p>Emplacement dans la brocante : ${emplacement}</p><br>

                        <p>Comment retrouver l'emplacement de l'exposant ?</p>
                        <p>Dans le mail de confirmation de réservation, vous retrouverez les coordonnées de l'exposant afin qu'il vous communique si ce n'est pas déjà fait, le plan de la brocante sur lequel figure son emplacement.</p><br>

                        <p>N’hésitez pas à contacter l'exposant dès maintenant pour organiser les détails de la transaction de l'article.
                        Veuillez noter que Broc en ligne ne gère pas cette étape entre les utilisateurs et les exposants.</p>

                        <p>Si vous n'êtes pas l'auteur de cette action, veuillez contacter notre support pour plus d'informations.</p>
                        <a href="${this.clientUrl}/contact">Lien vers la page contact</a>
                        
                        <br>
                        <p>Cordialement,</p>
                        <p>L'équipe Broc en ligne</p>
                    </body>
                    </html>`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailConfirmCancelReservationSeller(email: string, subject: string, usernameSeller: string,
        articleName: string, usernameBuyer: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
                    <head>
                        <style>
                        </style>
                    </head>
                    <body>
                        <p>Bonjour ${usernameSeller},</p><br>
                        <p>Nous vous informons que la reservation  de votre article ${articleName} a été annulée par ${usernameBuyer} sur Broc en ligne.</p><br>

                        <p>Pour info votre article sera de nouveau reservable !</p>

                        <br>
                        <p>Cordialement,</p>
                        <p>L'équipe Broc en ligne</p>
                    </body>
                    </html>`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailConfirmCancelReservationBuyer(email: string, subject: string, articleName: string, usernameBuyer: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
                    <head>
                        <style>
                        </style>
                    </head>
                    <body>
                        <p>Bonjour ${usernameBuyer},</p><br>
                        <p>Nous vous informons votre réservation pour l'article suivant : ${articleName} a bien été annulée.</p>

                        <p>Si vous n'êtes pas l'auteur de cette action, veuillez contacter notre support pour plus d'informations.</p>
                        <a href="${this.clientUrl}/contact">Lien vers la page contact</a>
                        
                        <br>
                        <p>Cordialement,</p>
                        <p>L'équipe Broc en ligne</p>
                    </body>
                    </html>`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }


    public async sendMailConfirmApplyMarket(email: string, subject: string, username: string, marketName: string, marketPlace: string, marketDate: string, marketUserPlace: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
            <head>
                <style>
                </style>
            </head>
            <body>
                <p>Bonjour ${username},</p>
                <p>Nous vous remercions pour votre inscription à la brocante ${marketName}. Nous sommes ravis de vous compter parmi les exposants.</p>
                <p>Nous confirmons votre participation à la brocante ${marketName}, qui aura lieu le ${marketDate} à ${marketPlace}. Votre emplacement dans la brocante est situé à l'emplacement ${marketUserPlace}</p>
                <p>Nous espérons que votre participation sera couronnée de succès et que vous passerez un agréable moment. À bientôt sur Broc en ligne !</p>

                <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à contacter notre service d'assistance à l'adresse </p>
                <a href="${this.clientUrl}/contact">Lien vers la page contact</a>

                <br>
                <p>Cordialement,</p>
                <p>L'équipe Broc en ligne</p>
            </body>
            </html>`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailConfirmConfirmContact(email: string, subject: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
            <head>
                <style>
                </style>
            </head>
            <body>
                <p>Bonjour,</p>
                <p>Nous avons bien reçu votre message et nous vous remercions d'avoir contacté le support client de Broc en ligne.</p>
                <p>Nous sommes désolés que vous ayez rencontré un problème et nous mettons tout en œuvre pour vous aider dans les plus brefs délais.</p>
                <p>Nous vous confirmons que votre demande a bien été prise en compte et que notre équipe vous répondra dans les plus brefs délais.</p>
                <p>N'hésitez pas à nous contacter à nouveau si vous avez des questions supplémentaires.</p>
                <br>
                <p>Cordialement,</p>
                <p>L'équipe Broc en ligne</p>
            </body>
            </html>`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailConfirmConfirmSupport(email: string, subject: string, rubrique: string, raison: string, role: string, object: string, message: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
            <head>
                <style>
                </style>
            </head>
            <body>
                <p>Rubrique :  ${rubrique}</p>
                <p>Email :  ${email}</p>
                <p>Raison :  ${raison}</p>
                <p>Role :  ${role}</p>
                <p>Objet :  ${object}</p>
                <p>Message :  ${message}</p> 
            </body>
            </html>`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailConfirmCancelFleamarket(email: string, subject: string, username: string, fleatitle: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
            <head>
                <style>
                </style>
            </head>
            <body>
            <p>Cher(e) ${username},</p>

            <p>Nous vous remercions d'avoir manifesté votre intérêt pour la brocante ${fleatitle}. Cependant, nous avons bien pris en compte votre demande d'annulation de votre participation à cet événement.</p>
            
            <p>Nous comprenons que les circonstances peuvent changer et que vous avez des raisons personnelles pour annuler votre participation. Votre demande a été traitée avec succès et nous confirmons donc l'annulation de votre inscription à la brocante ${fleatitle}.
            Nous espérons que vous pourrez participer à nos futurs événements et que vous aurez l'occasion de nous rejoindre à une prochaine brocante.</p>
            
            <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à contacter notre service d'assistance à l'adresse </p>
            <a href="${this.clientUrl}/contact">Lien vers la page contact</a>
            
            <p>Cordialement,</p>
            <p>L'équipe Broc en ligne.</p>
            </body>
            </html>`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    public async sendMailConfirmCancelArticleFlea(email: string, subject: string, username: string, fleatitle: string) {
        const mailOptions = {
            from: this.mailApp,
            to: email,
            subject: subject,
            html: `<html>
            <head>
                <style>
                </style>
            </head>
            <body>
            <p>Cher(e) ${username},</p>

            <p>Nous tenons à vous informer qu'une modification importante s'est produite concernant votre réservation pour l'article que vous avez sélectionné à la brocante ${fleatitle}.
             Malheureusement, l'exposant responsable de cet article a annulé sa participation à l'événement.</p>
            
            <p>Nous comprenons que cela peut être décevant et nous nous excusons pour les désagréments que cela peut causer. 
            Nous faisons tout notre possible pour offrir une expérience agréable et sans accroc à nos utilisateurs, mais parfois des circonstances imprévues peuvent survenir.</p>

            <p>Veuillez noter que votre réservation pour cet article a été annulée et nous vous encourageons à explorer les autres articles disponibles sur Broc en ligne. 
            Nous avons une grande variété de produits intéressants proposés par d'autres exposants qui pourraient correspondre à vos attentes.</p>
            
            <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à contacter notre service d'assistance à l'adresse </p>
            <a href="${this.clientUrl}/contact">Lien vers la page contact</a>

            <p>Encore une fois, nous vous présentons nos excuses pour cette situation indépendante de notre volonté. Nous espérons avoir l'opportunité de vous satisfaire lors de nos prochaines brocantes et nous restons à votre disposition pour toute autre demande.</p>
            
            
            <p>Cordialement,</p>
            <p>L'équipe Broc en ligne.</p>
            </body>
            </html>`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return { success: info.messageId };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }
}
