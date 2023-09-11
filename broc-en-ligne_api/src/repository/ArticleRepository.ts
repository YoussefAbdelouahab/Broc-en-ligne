import { File } from "../entity/File";
import { Article } from "../entity/Article";
import { Rate } from "../entity/Rate";
import { User } from "../entity/User";
import { FleaMarket } from "../entity/FleaMarket";
import { AppDataSource } from "../db/data-source";
import { Brackets } from "typeorm";
import { UserFleamarket } from "../entity/UserFleaMarket";

export function getUserArticle(id) {
  const articles = AppDataSource.createQueryBuilder()
    .select()
    .from(Article, "article")
    .where("userId = :id", { id: id })
    .leftJoin("article.file", "file", "article.id = file.articleId")
    .execute();
  return articles;
}

export function checkRates(scored_id: string, scoring_id: string) {
  const rate = AppDataSource.createQueryBuilder()
    .select()
    .from(Rate, "rate")
    .where("userId = :id", { id: scored_id })
    .andWhere("scoring_user = :id2", { id2: scoring_id })
    .getExists();
  return rate;
}

export function getAllUserRate(id) {
  const rates = AppDataSource.createQueryBuilder()
    .select()
    .from(Rate, "rate")
    .where("userId = :id", { id: id })
    .execute();
  return rates;
}

export async function searchArticleBar(search, localisation, bcategory) {
  const article = AppDataSource.getRepository(Article)
    .createQueryBuilder("article")
    .select()
    .leftJoin("article.user", 'user', "article.userId = user.id")
    .leftJoin("article.file", 'file', "article.id = file.articleId")
    .andWhere(new Brackets(qb => {
      qb.where("article.title like :search")
        .orWhere("article.content like :search")
    }))
    .setParameter("search", `%${search}%`);

  if (bcategory) {
    article.andWhere("article.categoryId = :category", { category: bcategory });
  }

  const result = await article.execute();
  return result;
  // }
}


export async function searchFleaBar(zipCode, type) {
  const currentDate = new Date();

  const fleaMarketQueryBuilder = AppDataSource
    .getRepository(FleaMarket)
    .createQueryBuilder("flea_market")
    .leftJoinAndSelect("flea_market.localisation", 'localisation')
    .where("flea_market.event_date > :currentDate", { currentDate })
    .orderBy({
      "flea_market.event_date": "ASC"
    });

  if (zipCode > 0) {
    fleaMarketQueryBuilder.andWhere("SUBSTRING(localisation.zip_code, 1, 2) = :zipCode", { zipCode });
  }

  if (type) {
    fleaMarketQueryBuilder.andWhere("flea_market.type = :type", { type });
  }

  const result = await fleaMarketQueryBuilder.getMany();
  return result;
}


export async function ApplyFlea(userId, fleaId, position) {
  const userFlea = AppDataSource
    .createQueryBuilder()
    .insert()
    .into('user_fleamarket')
    .values([
      { userId: userId, fleaMarketId: fleaId, position: position }
    ])
    .execute()
  return userFlea;
}

export async function getUserFlea(userId) {
  const currentDate = new Date();

  const Flea = await AppDataSource
    .getRepository(UserFleamarket)
    .createQueryBuilder("userFleamarket")
    .leftJoinAndSelect("userFleamarket.fleaMarket", "fleaMarket")
    .leftJoinAndSelect("fleaMarket.localisation", "localisation")
    .where("fleaMarket.event_date > :currentDate", { currentDate })
    .andWhere("userFleamarket.userId = :userId", { userId })
    .orderBy("fleaMarket.event_date", "ASC")
    .getMany();

  return Flea;
}