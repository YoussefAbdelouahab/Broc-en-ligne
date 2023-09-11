import { JsonController, Param, Body, Get, Post, Put, Delete, Req, UseBefore, Patch, Res, QueryParam } from 'routing-controllers';
import { AppDataSource } from '../db/data-source';
import { NodeMailerSendEmail } from "../email/NodeMailerSendEmail"
import * as moment from 'moment';
import 'moment/locale/fr';

import { FleaMarket } from '../entity/FleaMarket';
import { User } from '../entity/User';
import { UserFleamarket } from '../entity/UserFleaMarket';
import { Localisation } from '../entity/Localisation';
import { Reservation } from '../entity/Reservation';
import { searchFleaBar, ApplyFlea, getUserFlea } from "../repository/ArticleRepository";
import { Authentification } from "../middleware/auth";
import { Response } from 'express';
import { getFleamarketsTypes } from "../repository/FleamarketRepository";
import { LessThan } from "typeorm";

@JsonController()
export class FlearMarketController {
    private mailer = new NodeMailerSendEmail();

    constructor(private fleaMarketRepository, private localisationRepository, private userRepository, private userFleamarketRepository, private reservationRepository) {
        this.fleaMarketRepository = AppDataSource.getRepository(FleaMarket);
        this.localisationRepository = AppDataSource.getRepository(Localisation);
        this.userRepository = AppDataSource.getRepository(User);
        this.userFleamarketRepository = AppDataSource.getRepository(UserFleamarket);
        this.reservationRepository = AppDataSource.getRepository(Reservation);

    }

    @Post("/market")
    public async addFleaMarket(@Body() eventData: FleaMarket) {
        try {

            const fleamarketAlreadyExist: FleaMarket = await this.fleaMarketRepository.findOne({
                where: { event_id: eventData.getEvent_Id() }
            });

            if (fleamarketAlreadyExist) throw new Error('Fleamarket already exist');

            const fleaMarket: FleaMarket = eventData;
            const localisation: Localisation = eventData.getLocalisation();

            const localisationAlreadyExist = await this.localisationRepository.findOne({
                where: {
                    zip_code: localisation["zip_code"],
                    city: localisation["city"]
                }
            });

            if (!localisationAlreadyExist) {
                await this.localisationRepository.save(localisation);
                fleaMarket.setLocalisation(localisation);
                console.log('localisation added to database')
            } else {
                fleaMarket.setLocalisation(localisationAlreadyExist);
                console.log('localisation already exist')
            }

            this.fleaMarketRepository.save(fleaMarket)

            return { success: "successfully saved", fleaMarket: fleaMarket };
        } catch (error) {
            return { error: error.message };
        }
    }

    @Post("/checkifapplied")
    public async isUserInThisFleamarket(@Body() data: UserFleamarket) {
        const userFleamarketAlreadyExist: UserFleamarket = await this.userFleamarketRepository.findOne({
            where: {
                user: { id: data["userId"] },
                fleaMarket: {
                    id: data["fleamarketId"] // Check if event_date is less than the current date
                },
            },
        });

        return userFleamarketAlreadyExist;
    }

    @Post("/applymarket")
    public async ApplyMarket(@Body() data: UserFleamarket, @Res() res: Response) {
        try {
            const userFleaMarket: UserFleamarket = data;

            const user: User = await this.userRepository.findOne({
                where: { id: data["userId"] }
            })

            const fleamarket: FleaMarket = await this.fleaMarketRepository.findOne({
                where: { id: data["fleamarketId"] }
            })

            const userFleamarketAlreadyExist: UserFleamarket = await this.userFleamarketRepository.findOne({
                where: {
                    user: { id: user["id"] },
                    fleaMarket: {
                        id: fleamarket["id"]
                    }
                }
            })

            if (userFleamarketAlreadyExist) throw new Error("this user already applied to this fleamarket");

            userFleaMarket.setUser(user);
            userFleaMarket.setFleaMarket(fleamarket);

            const userFleamarket: UserFleamarket = await this.userFleamarketRepository.save(data);
            try {
                if (userFleamarket) {
                    await this.mailer.sendMailConfirmApplyMarket(user.getMail(), `Broc en ligne : votre inscription à la brocante ${fleamarket.getTitle()} a bien été enregistrée !`,
                        user.getUsername(), fleamarket.getTitle(), fleamarket.getAddress(), moment(fleamarket.getEvent_date()).format("dddd DD MMMM YYYY"), userFleamarket.getPosition());

                    return res.status(200).json({ success: "email sent" });
                }
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
            return { success: "user successfully applied to this fleamarket" }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Get("/market/search")
    public async searchFlea(@QueryParam("type") type: string, @QueryParam("localisation") zipCode: Localisation) {
        try {
            return await searchFleaBar(zipCode, type);
        } catch (error) {
            return { error: error.message };
        }
    }

    @Get('/market')
    public async getAll() {
        try {
            const fleamarkets: FleaMarket = await this.fleaMarketRepository.find({ order: { event_date: "ASC" } });
            if (!fleamarkets) throw new Error('Fleamarket not found')
            return fleamarkets;
        } catch (error) {
            return { error: error.message }
        }
    }

    @Get("/market/count")
    public async getCountMarket(
        @Res() res: Response
    ) {
        try {
            const count: FleaMarket = await this.fleaMarketRepository
                .createQueryBuilder("flea_market")
                .getCount();

            if (!count) return 0;

            return count;
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Get('/market/user/:userId')
    public async allUserFlea(@Param("userId") userId, @Res() res: Response) {
        try {
            const user: User = await this.userRepository.findOne({ where: { id: userId } })
            if (!user) throw new Error('User not found')

            let fleamarkets = await getUserFlea(userId);

            return res.status(200).json(fleamarkets);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Get('/types')
    public async allTypes() {
        try {
            return await getFleamarketsTypes();
        } catch (error) {
            console.log(error);
        }
    }

    @Get("/market/:event_id")
    public async getOne(@Param("event_id") event_id: string, @Res() res: Response) {
        try {
            const fleamarket: FleaMarket = await this.fleaMarketRepository.findOne({ where: { event_id: event_id } });
            if (!fleamarket) throw new Error("Account not found");
            return fleamarket;
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Delete("/market/:market_id/:user_id")
    public async deleteOne(@Param("market_id") market_id: string, @Param("user_id") user_id: string, @Res() res: Response) {
        try {
            const user: User = await this.userRepository.findOne({ where: { id: user_id } })
            if (!user) throw new Error("user not found");

            const fleamarket: FleaMarket = await this.fleaMarketRepository.findOne({ where: { id: market_id } })
            if (!fleamarket) throw new Error("Fleamarket not found");

            const userFleamarketAlreadyExist: UserFleamarket = await this.userFleamarketRepository.findOne({
                where: {
                    user: { id: user_id },
                    fleaMarket: { id: market_id },
                }
            });
            if (!userFleamarketAlreadyExist) throw new Error("Error, check if user in fleamarket failed !")

            try {
                await this.userFleamarketRepository.remove(userFleamarketAlreadyExist);
            } catch {
                throw new Error("Couldn't remove user fleamarket");
            }

            await this.mailer.sendMailConfirmCancelFleamarket(user.getMail(), `Broc en ligne : Annulation de votre participation à la brocante ${fleamarket.getTitle()}`, user.getUsername(), fleamarket.getTitle());


            const reservation = await this.reservationRepository.find({
                where: {
                    fleamarket: { id: market_id },
                    userExposant: { id: user_id }
                },
                relations: ['article', 'userVisitor'],
            });
            reservation.forEach(async element => {
                await this.reservationRepository.remove(element);
                await this.mailer.sendMailConfirmCancelArticleFlea(element["userVisitor"]["mail"], `Broc en ligne : Annulation de votre réservation pour l'article à la brocante ${fleamarket.getTitle()}`, element["userVisitor"]["username"], fleamarket.getTitle());
            });


            return res.status(200).json({ success: "UserFleaMarket deleted" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}