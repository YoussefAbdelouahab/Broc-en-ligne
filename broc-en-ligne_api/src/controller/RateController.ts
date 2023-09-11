import {
    JsonController,
    Param,
    Body,
    Get,
    Post,
    Delete,
    Req,
    UseBefore,
    Patch,
    Res,
} from "routing-controllers";
import { AppDataSource } from "../db/data-source";
import { checkRates, getAllUserRate } from "../repository/ArticleRepository";
import { User } from "../entity/User";
import { Rate } from "../entity/Rate";
import { Response } from "express";

@JsonController()
export class UserController {
    private clientUrl = "http://localhost:8000";

    constructor(private userRepository, private rateRepository) {
        this.userRepository = AppDataSource.getRepository(User);
        this.rateRepository = AppDataSource.getRepository(Rate);
    }

    @Post('/rate')
    async createRate(@Body() data: Rate, @Res() res: Response) {
        if (await checkRates(data["userId"], data["scoring_user"])) {
            throw new Error('You have already rated this user');
        } else {
            try {
                // Check if user exists
                const user = await this.userRepository.findOne({ where: { id: data["userId"] } });
                if (!user) {
                    throw new Error('User not found');
                }
                // Create new article
                const rate: Rate = data;
                rate.setUser(user);

                await this.rateRepository.save(rate);

                return res.status(200).json({ success: 'Rate saved' });
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        }

    }

    @Get('/rate/:username')
    async getUserRate(@Param("username") username: string, @Res() res: Response) {
        try {
            const averageRate = await this.rateRepository.createQueryBuilder("rate")
                .select("AVG(rate.score)", "averageRage")
                .leftJoin("rate.user", "user")
                .where("user.username = :username", { username })
                .getRawOne()

            const count: Rate[] = await this.rateRepository
                .createQueryBuilder("rate")
                .leftJoinAndSelect("rate.user", "user")
                .where("user.username = :username", { username })
                .getCount();

            return res.status(200).json({ averageRate, count })
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }



}
