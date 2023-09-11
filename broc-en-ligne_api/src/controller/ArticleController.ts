import {
  JsonController,
  Body,
  Post,
  UploadedFile,
  Get,
  Param,
  UploadedFiles,
  Delete,
  Res,
  QueryParam,
  Patch,
  UseBefore,
} from "routing-controllers";
import { getUserFlea, searchArticleBar } from "../repository/ArticleRepository";
import { AppDataSource } from "../db/data-source";
import { Article } from "../entity/Article";
import { File } from "../entity/File";
import {
  multerConfig
} from "../config/multer";
import { User } from "../entity/User";
import * as fs from "fs";
import * as path from "path";
import { Response } from "express";
import { Category } from "../entity/Category";
import { Brackets } from "typeorm";
import { Localisation } from "../entity/Localisation";
import { Authorisation } from "../middleware/permission";


@JsonController()
export class ArticleController {
  constructor(
    public articleRepository,
    public categoryRepository,
    public fileRepository,
    public userRepository,
    private fleamarketRepository
  ) {
    this.articleRepository = AppDataSource.getRepository(Article);
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.fileRepository = AppDataSource.getRepository(File);
    this.userRepository = AppDataSource.getRepository(User);
  }

  @Post('/article')
  async createArticle(
    @Body() data: Article,
    @Body() fileData: File,
    @UploadedFiles('url', { options: multerConfig }) storedFiles: Array<any>,
    @Res() res: Response,
  ) {
    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: data.getUser() } });
      if (!user) {
        throw new Error('User not found');
      }

      // Check if category exists
      const category = await this.categoryRepository.findOne({ where: { id: data.getCategory() } });
      if (!category) {
        throw new Error('Category not found');
      }

      var d = new Date();
      // Create new article
      const article = this.articleRepository.create({
        ...data,
        user,
        category,
        status: 0,
        created_at: d
      });
      await this.articleRepository.save(article);

      if (storedFiles.length == 0) throw new Error("File required");

      // Create new files and associate them with the article
      const files = storedFiles.map((file) => {
        return this.fileRepository.create({
          ...fileData,
          article,
          url: file.filename,
        });
      });
      await this.fileRepository.save(files);

      return res.status(200).json({ success: 'Article created' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/article/:id")
  public async getArticle(@Param("id") id: string, @Res() res: Response) {
    try {
      const article: Article = await this.articleRepository
        .createQueryBuilder("article")
        .leftJoinAndSelect("article.file", "file")
        .leftJoinAndSelect("article.user", "user")
        .leftJoinAndSelect("article.category", "category")
        .where("article.id = :id", { id })
        .orderBy("file.created_at", "DESC")
        .getOne();

      if (!article) throw new Error("Article not found");

      return article;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/articles")
  public async getArticles(
    @Res() res: Response
  ) {
    try {
      const articles: Article[] = await this.articleRepository
        .createQueryBuilder("article")
        .leftJoinAndSelect("article.file", "file")
        .leftJoinAndSelect("article.user", "user")
        .leftJoinAndSelect("user.userFleamarkets", "userFleaMarket")
        .leftJoinAndSelect("userFleaMarket.fleaMarket", "fleaMarket")
        .leftJoinAndSelect("fleaMarket.localisation", "localisation")
        .leftJoinAndSelect("article.category", "category")
        .orderBy("fleaMarket.event_date", "ASC")
        .orderBy("article.created_at", "DESC")
        .orderBy("file.created_at", "DESC")
        .getMany();

      if (!articles) throw new Error("Articles not found");

      return res.status(200).json(articles);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/articles/slider/:limit")
  public async getArticlesSlider(
    @Res() res: Response,
    @Param("limit") limit: string
  ) {
    try {
      const articles: Article[] = await this.articleRepository
        .createQueryBuilder("article")
        .leftJoinAndSelect("article.file", "file")
        .leftJoinAndSelect("article.user", "user")
        .leftJoinAndSelect("user.userFleamarkets", "userFleaMarket")
        .leftJoinAndSelect("userFleaMarket.fleaMarket", "fleaMarket")
        .leftJoinAndSelect("fleaMarket.localisation", "localisation")
        .leftJoinAndSelect("article.category", "category")
        .where("fleaMarket.event_date > :currentDate", { currentDate: new Date() })
        .orderBy("fleaMarket.event_date", "ASC")
        .orderBy("article.created_at", "DESC")
        .orderBy("file.created_at", "DESC")
        .take(limit)
        .getMany();

      if (!articles) throw new Error("Articles not found");

      // Triez les flea markets dans chaque article du plus proche au plus éloigné
      articles.forEach((article) => {
        article.user.userFleamarkets.sort((a, b) => {
          const eventDateA = new Date(a.fleaMarket["event_date"]).getTime();
          const eventDateB = new Date(b.fleaMarket["event_date"]).getTime();
          return eventDateA - eventDateB;
        });
      });

      return res.status(200).json(articles);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/articles/slider/:id/:limit")
  public async getArticleByCategorySlider(
    @Res() res: Response,
    @Param("id") id: number,
    @Param("limit") limit: string
  ) {
    try {
      const articles: Article[] = await this.articleRepository
        .createQueryBuilder("article")
        .leftJoinAndSelect("article.file", "file")
        .leftJoinAndSelect("article.user", "user")
        .leftJoinAndSelect("user.userFleamarkets", "userFleaMarket")
        .leftJoinAndSelect("userFleaMarket.fleaMarket", "fleaMarket")
        .leftJoinAndSelect("fleaMarket.localisation", "localisation")
        .leftJoinAndSelect("article.category", "category")
        .where("fleaMarket.event_date > :currentDate", { currentDate: new Date() })
        .orderBy("fleaMarket.event_date", "ASC")
        .orderBy("article.created_at", "DESC")
        .orderBy("file.created_at", "DESC")
        .take(limit)
        .getMany();

      if (!articles) throw new Error("Articles not found");

      // Triez les flea markets dans chaque article du plus proche au plus éloigné
      articles.forEach((article) => {
        article.user.userFleamarkets.sort((a, b) => {
          const eventDateA = new Date(a.fleaMarket["event_date"]).getTime();
          const eventDateB = new Date(b.fleaMarket["event_date"]).getTime();
          return eventDateA - eventDateB;
        });
      });

      return res.status(200).json(articles);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/articles/:userId/count")
  public async getCountArticleByUser(
    @Res() res: Response,
    @Param("userId") userId: string
  ) {
    try {
      const count: Article[] = await this.articleRepository
        .createQueryBuilder("article")
        .leftJoinAndSelect("article.user", "user")
        .where("user.id = :userId", { userId: userId })
        .getCount();

      if (!count) throw new Error("Articles not found");

      return count;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/articles/count")
  public async getCountArticle(
    @Res() res: Response
  ) {
    try {
      const count: Article = await this.articleRepository
        .createQueryBuilder("article")
        .getCount();

      if (!count) return 0;

      return count;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/article/user/:id")
  async getArticleByUserId(@Param("id") id: string, @Res() res: Response) {
    try {
      const user: User = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.article", "article")
        .leftJoinAndSelect("article.file", "file")
        .where({ id })
        .orderBy("article.created_at", "DESC")
        .orderBy("file.created_at", "DESC")
        .getMany();

      if (!user) throw new Error("User not found");

      return user;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/article/user/username/:username")
  async getArticleByUserUsername(@Param("username") username: string, @Res() res: Response) {
    try {
      const user: User = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.article", "article")
        .leftJoinAndSelect("article.file", "file")
        .where({ username })
        .orderBy("article.created_at", "DESC")
        .orderBy("file.created_at", "DESC")
        .getMany();

      if (!user) throw new Error("User not found");

      return user;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Patch('/article/:id')
  public async updateArticle(
    @Body() data: Article,
    @Body() fileData: File,
    @UploadedFiles("url", { options: multerConfig }) storedFiles: Array<any>,
    @Param('id') id: string,
    @Res() res: Response) {
    try {
      const article: Article = await this.articleRepository.findOne({ where: { id: id } })
      if (!article) throw new Error('Article not found');

      if (!storedFiles) throw new Error("File required");

      const files = storedFiles.map((file) => {
        return this.fileRepository.create({
          ...fileData,
          article,
          url: file.filename,
        });
      });
      await this.fileRepository.save(files);

      await this.articleRepository.save({ ...article, ...data });

      return res.status(200).json({ success: "Article updated" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/articles/search")
  public async searchArticleByTitleLocalisationCategory(@QueryParam("title") title: string,
    @QueryParam("localisation") zipCode: number,
    @QueryParam("category") category: number,
    @Res() res: Response) {
    try {

      let queryBuilder = await this.articleRepository
        .createQueryBuilder("article")
        .leftJoinAndSelect("article.file", "file")
        .leftJoinAndSelect("article.user", "user")
        .leftJoinAndSelect("user.userFleamarkets", "userFleaMarket")
        .leftJoinAndSelect("userFleaMarket.fleaMarket", "fleaMarket")
        .leftJoinAndSelect("fleaMarket.localisation", "localisation")
        .leftJoinAndSelect("article.category", "category")
        .where("fleaMarket.event_date > :currentDate", { currentDate: new Date() })
        .andWhere(
          new Brackets((qb) => {
            qb.where("article.title like :search", { search: `%${title}%` })
              .orWhere("article.content like :search", { search: `%${title}%` });
          })
        )
        .orderBy("fleaMarket.event_date", "ASC")
        .orderBy("article.created_at", "DESC")
        .orderBy("file.created_at", "DESC")

      if (category !== 0) {
        queryBuilder = queryBuilder.andWhere("category.id = :categoryId", { categoryId: category })
      }

      if (zipCode !== 0) {
        queryBuilder = queryBuilder.andWhere("SUBSTRING(localisation.zip_code, 1, 2) = :zipCode", { zipCode });
      }

      const articles: Article[] = await queryBuilder.getMany();

      if (!articles) throw new Error("Articles not found");

      // Triez les flea markets dans chaque article du plus proche au plus éloigné
      articles.forEach((article) => {
        article.user.userFleamarkets.sort((a, b) => {
          const eventDateA = new Date(a.fleaMarket["event_date"]).getTime();
          const eventDateB = new Date(b.fleaMarket["event_date"]).getTime();
          return eventDateA - eventDateB;
        });
      });

      return res.status(200).json(articles);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete('/article/:id')
  public async deleteArticle(@Param('id') id: string, @Res() res: Response) {
    try {
      const article = await this.articleRepository.findOne({ relations: ['file'], where: { id: id } });
      if (!article) throw new Error('Article not found');

      const filesToDelete = article.file.map(file => file.url); // récupère la liste des URL de fichiers à supprimer

      await this.articleRepository.remove(article);

      // Supprime chaque fichier de la liste
      filesToDelete.forEach(url => {
        const filePath = path.join(__dirname, "..", "..", "..", "broc-en-ligne_react", "src", "media", url);
        fs.unlinkSync(filePath); // supprime le fichier
      });

      return res.status(200).json({ success: "Article deleted" });

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Delete("/article/:id/admin")
  @UseBefore(Authorisation)
  public async deleteArticleAdmin(@Param('id') id: string, @Res() res: Response) {
    try {
      const article = await this.articleRepository.findOne({ relations: ['file'], where: { id: id } });
      if (!article) throw new Error('Article not found');

      const filesToDelete = article.file.map(file => file.url); // récupère la liste des URL de fichiers à supprimer

      await this.articleRepository.remove(article);

      // Supprime chaque fichier de la liste
      filesToDelete.forEach(url => {
        const filePath = path.join(__dirname, "..", "..", "..", "broc-en-ligne_react", "src", "media", url);
        fs.unlinkSync(filePath); // supprime le fichier
      });

      return res.status(200).json({ success: "Article deleted" });

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
