import { JsonController, Get, Post, Body, Res, Param, Delete } from 'routing-controllers';
import { AppDataSource } from '../db/data-source';
import { Reservation } from '../entity/Reservation';
import { User } from '../entity/User';
import { Article } from '../entity/Article';
import { FleaMarket } from '../entity/FleaMarket';
import { Response } from 'express';
import { NodeMailerSendEmail } from "../email/NodeMailerSendEmail"
import { getUserFlea } from "../repository/ArticleRepository";
import * as moment from 'moment';
import 'moment/locale/fr';
import { UserFleamarket } from '../entity/UserFleaMarket';


@JsonController()
export class FlearMarketController {
    private mailer = new NodeMailerSendEmail();

    constructor(private reservationRepository, private userRepository, private articleRepository, private fleamarketRepository) {
        this.reservationRepository = AppDataSource.getRepository(Reservation);
        this.userRepository = AppDataSource.getRepository(User);
        this.articleRepository = AppDataSource.getRepository(Article);
        this.fleamarketRepository = AppDataSource.getRepository(FleaMarket);
    }

    @Post('/reservation')
    public async createReservation(@Body() data: Reservation, @Res() res: Response) {
        try {
            const userVisitor: User = await this.userRepository.findOne({
                where: { id: data["userVisitorId"] },
            });
            if (!userVisitor) throw new Error("userVisitor not Found");

            const userExposant: User = await this.userRepository.findOne({
                where: { id: data["userExposantId"] },
            });
            if (!userExposant) throw new Error("userExposant not Found");

            const article: Article = await this.articleRepository.findOne({
                where: {
                    id: data["articleId"],
                    user: { id: data["userExposantId"] }
                },
            });
            if (!article) throw new Error("Article not found or User not match ");

            const fleamarket: FleaMarket = await this.fleamarketRepository.findOne({
                where: { id: data["fleamarketId"] },
            });
            if (!fleamarket) throw new Error("Fleamarket not found");

            let position = await getUserFlea(data["userExposantId"]);
            if (!position) throw new Error("Fleamarket not found");

            data.setStatus(0);
            data.setUserExposant(userExposant)
            data.setUserVisitor(userVisitor)
            data.setArticle(article)
            data.setFleamarket(fleamarket)
            // return data;
            await this.reservationRepository.save(data);

            // Status = 1 = reserved 
            article.setStatus(1);
            await this.articleRepository.save(article);

            await this.mailer.sendMailConfirmReservationSeller(userExposant.getMail(), `Broc en ligne : votre article ${article.getTitle()} a été réservé!`, userExposant.getUsername(),
                article.getTitle(), userVisitor.getUsername(), userVisitor.getMail(), userVisitor.getPhone(), fleamarket.getTitle(), fleamarket.getAddress(), data["delivery_hour"], moment(fleamarket.getEvent_date()).format("dddd DD MMMM YYYY"), position[0]["position"]);

            await this.mailer.sendMailConfirmReservationBuyer(userVisitor.getMail(), "Broc en ligne : votre réservation a bien été enregistrée", userExposant.getUsername(),
                article.getTitle(), userVisitor.getUsername(), userExposant.getMail(), userExposant.getPhone(), fleamarket.getTitle(), fleamarket.getAddress(), data["delivery_hour"], moment(fleamarket.getEvent_date()).format("dddd DD MMMM YYYY"), position[0]["position"]);

            /*Return response*/
            return res.status(200).json({ success: "Reservation created" });
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get('/reservation')
    public async getAll() {
        try {
            const reservation: Reservation = await this.reservationRepository.find({
                relations: ["userExposant", "userVisitor", "article", "fleamarket", "fleamarket.localisation"]
            });
            if (!reservation) throw new Error('Reservation not found')
            return reservation;
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get("/reservations/count")
    public async getCountReservation(
        @Res() res: Response
    ) {
        try {
            const count: Reservation = await this.reservationRepository
                .createQueryBuilder("reservation")
                .getCount();

            if (!count) return 0;

            return count;
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Get('/reservation/:userId')
    public async allUserReservation(@Param("userId") userId: User, @Res() res: Response) {
        try {
            // Vérifie si l'utilisateur existe
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error(`Utilisateur avec ID ${userId} n'existe pas`);
            }

            const reservation: Reservation[] = await this.reservationRepository
                .createQueryBuilder("reservation")
                .where("reservation.userVisitorId = :userId", { userId })
                .leftJoinAndSelect("reservation.article", "article")
                .leftJoinAndSelect("article.file", "file")
                .leftJoinAndSelect("article.user", "user")
                .leftJoinAndSelect("reservation.fleamarket", "fleamarket")
                .leftJoinAndSelect("fleamarket.localisation", "localisation")
                .orderBy("file.created_at", "DESC")
                .getMany();

            if (!reservation) throw new Error('Reservation not found')

            return res.status(200).json(reservation);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Delete('/reservation/:articleId/:userVisitorId')
    public async cancelReservation(@Param('articleId') articleId: Article, @Param('userVisitorId') userVisitorId: User, @Res() res: Response, fleaMarket: UserFleamarket) {
        try {

            const reservation: Reservation = await this.reservationRepository.findOne({
                where: {
                    article: { id: articleId },
                    userVisitor: { id: userVisitorId }
                },
                relations: ['article', 'userVisitor', 'userExposant', 'fleamarket'],
            });

            let event_date = reservation["fleamarket"]["event_date"];
            // console.log(event_date);

            const dateNow = new Date();
            const eventDate = new Date(event_date);

            console.log(eventDate.getTime() - dateNow.getTime())

            const twentyFourHours = 86400000; // 24 hours in milliseconds

            if (eventDate.getTime() - dateNow.getTime() >= twentyFourHours) {
                // L'utilisateur peut annuler la réservation car elle a été créée plus de 24 heures avant l'événement
                await this.reservationRepository.remove(reservation);

                const article: Article = reservation.getArticle();
                article.setStatus(0);
                await this.articleRepository.save(article);

                await this.mailer.sendMailConfirmCancelReservationBuyer(reservation.getUserVisitor().getMail(), "Broc en ligne : Annulation de votre réservation", article.getTitle(), reservation.getUserVisitor().getUsername());

                await this.mailer.sendMailConfirmCancelReservationSeller(reservation.getUserExposant().getMail(), `Broc en ligne : La réservation de votre article ${reservation.getArticle().getTitle()} a été annulée!`, reservation.getUserExposant().getUsername(), article.getTitle(), reservation.getUserVisitor().getUsername());

                return res.status(200).json({ success: "Réservation annulée" });
            } else {
                // L'utilisateur ne peut pas annuler la réservation 24 heures avant l'événement
                return res.status(400).json({ error: "La réservation ne peut pas être annulée 24 heures avant la date de l'événement." });
            }

        } catch (error) {
            return { error: error.message }
        }
    }

    @Get('/reservation/:articleId/:userVisitorId')
    public async verifReservation(@Param('articleId') articleId: Article, @Param('userVisitorId') userVisitorId: User, @Res() res: Response, fleaMarket: UserFleamarket) {
        try {

            const reservation: Reservation = await this.reservationRepository.findOne({
                where: {
                    article: { id: articleId },
                    userVisitor: { id: userVisitorId }
                },
                relations: ['article', 'userVisitor', 'userExposant'],
            });

            return res.status(200).json(reservation);

        } catch (error) {
            return { error: error.message }
        }
    }



}