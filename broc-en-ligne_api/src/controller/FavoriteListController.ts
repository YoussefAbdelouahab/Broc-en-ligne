import {
    JsonController,
    Param,
    Body,
    Get,
    Post,
    Delete,
    Patch,
    Res,
    QueryParam,
} from "routing-controllers";
import { AppDataSource } from "../db/data-source";
import { User } from "../entity/User";
import { FavoriteList } from "../entity/FavoriteList";
import { getUserFavoriteList, countArticleFav, CheckArticleFav, DeleteArticleFav } from "../repository/FavoriteRepository";
import { Response } from "express";
import { Article } from "../entity/Article";
import { getUserFlea } from "../repository/ArticleRepository";


@JsonController()
export class FavoriteListController {

    constructor(private userRepository, private articleRepository, private favoritelistRepository) {
        this.userRepository = AppDataSource.getRepository(User);
        this.articleRepository = AppDataSource.getRepository(Article);
        this.favoritelistRepository = AppDataSource.getRepository(FavoriteList);
    }

    @Post("/favorite/article/")
    public async CreateArticleFav(@Body() data, @Res() res: Response) {
        try {
            // Vérifie si l'utilisateur existe
            const user = await this.userRepository.findOne({ where: { id: data.userId } });
            if (!user) {
                throw new Error(`Utilisateur avec ID ${data.userId} n'existe pas`);
            }

            // Vérifie si l'article existe
            const article = await this.articleRepository.findOne({ where: { id: data.articleId } });
            if (!article) {
                throw new Error(`Article avec ID ${data.articleId} n'existe pas`);
            }

            // Vérifie si l'utilisateur a déjà une liste de favoris
            let favoriteList = await this.favoritelistRepository.findOne({
                where: { user: { id: data.userId } },
                relations: ['article'],
            });

            // Si l'utilisateur n'a pas de liste de favoris, en créer une nouvelle
            if (!favoriteList) {
                favoriteList = new FavoriteList();
                favoriteList.user = user;
                favoriteList.article = [];
            }

            // Vérifie si l'article est déjà dans la liste de favoris de l'utilisateur
            let existingFavorite = await this.favoritelistRepository.findOne({
                where: { user: { id: data.userId }, article: { id: data.articleId } }
            });

            // Si l'article est déjà dans la liste de favoris, ne fait rien
            if (existingFavorite) {
                return existingFavorite;
            }

            // Ajoute l'article à la liste de favoris de l'utilisateur
            favoriteList.article.push(article);
            await this.favoritelistRepository.save(favoriteList);

            return res.status(200).json({ success: "article add in favorite list" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Get("/favorite/user/:id")
    public async getUserFav(@Param("id") id: string, @Res() res: Response) {
        try {
            // Vérifie si l'utilisateur existe
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new Error(`Utilisateur avec ID ${id} n'existe pas`);
            }

            const favoriteList = await this.favoritelistRepository
                .createQueryBuilder("favorite_list")
                .where("favorite_list.user.id = :userId", { userId: id })
                .leftJoinAndSelect("favorite_list.article", "article")
                .leftJoinAndSelect("article.file", "file")
                .leftJoinAndSelect("article.user", "user")
                .leftJoinAndSelect("user.userFleamarkets", "userFleaMarket")
                .leftJoinAndSelect("userFleaMarket.fleaMarket", "fleaMarket")
                .leftJoinAndSelect("fleaMarket.localisation", "localisation")
                .where("fleaMarket.event_date > :currentDate", { currentDate: new Date() })
                .orderBy("fleaMarket.event_date", "ASC")
                .orderBy("article.created_at", "DESC")
                .orderBy("file.created_at", "DESC")
                .getMany();

            // Triez les flea markets dans chaque article du plus proche au plus éloigné
            favoriteList.forEach((favorite) => {
                if (favorite.article.user) {
                    favorite.article.user.userFleamarkets.sort((a, b) => {
                        const eventDateA = new Date(a.fleaMarket.event_date).getTime();
                        const eventDateB = new Date(b.fleaMarket.event_date).getTime();
                        return eventDateA - eventDateB;
                    });
                }
            });

            return res.status(200).json(favoriteList);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Get("/favorite/article/:id")
    public async getCountArticleFav(@Param("id") id: string, @Res() res: Response) {
        try {
            const article: Article = await this.articleRepository.findOne({
                relations: ["file", "user", "category"],
                where: { id: id },
            });
            if (!article) throw new Error("Article not found");

            const count = await countArticleFav(article.getId());

            return res.status(200).json({ nbr: count[0]['COUNT(*)'] });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Delete("/favorite/delete/")
    public async DeleteArticleFav(@QueryParam("articleId") articleId: string, @QueryParam("userId") userId: string, @Res() res: Response) {
        try {
            const article: Article = await this.articleRepository.findOne({
                relations: ["file", "user", "category"],
                where: { id: articleId },
            });
            if (!article) throw new Error("Article not found");

            const userFavId = await getUserFavoriteList(userId);

            await DeleteArticleFav(userFavId[0]['id'], article.getId())

            return res.status(200).json({ success: "Article deleted from favorite list" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Get("/favorite/verif/")
    public async getCheckArticleFAv(@QueryParam("articleId") articleId: string, @QueryParam("userId") userId: string, @Res() res: Response) {
        try {
            const article: Article = await this.articleRepository.findOne({
                relations: ["file", "user", "category"],
                where: { id: articleId },
            });
            if (!article) throw new Error("Article not found");

            const userFavId = await getUserFavoriteList(userId);

            const result = await CheckArticleFav(userFavId[0]['id'], article.getId())

            if (result.length > 0) {
                return res.status(200).json({ ko: "Article already liked" });
            } else {
                return res.status(200).json({ ok: "Article can be liked" });
            }
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
