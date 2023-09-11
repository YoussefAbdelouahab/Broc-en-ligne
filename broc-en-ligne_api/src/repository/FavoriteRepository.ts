import { AppDataSource } from "../db/data-source";
import { FavoriteList } from "../entity/FavoriteList";

export async function getUserFavoriteList(id) {
  const userFavorite = AppDataSource.createQueryBuilder()
    .select("id")
    .from(FavoriteList, "favoritelist")
    .where("userId = :id", { id: id })
    .execute();
  return userFavorite;
}

export async function CheckArticleFav(UserFavId, ArticleId) {
  const VerifArticle = AppDataSource
    .query(`SELECT * FROM article_favoritelist WHERE articleId = "${ArticleId}" and favoriteListId = "${UserFavId}"`)
  return VerifArticle;
}

export async function countArticleFav(id) {
  const Count = AppDataSource
    .query(`SELECT COUNT(*) FROM article_favoritelist WHERE articleId = "${id}"`)
  return Count;
}


export async function DeleteArticleFav(UserFavId, ArticleId) {
  const ArticleDelete = AppDataSource
    .query(`DELETE FROM article_favoritelist WHERE articleId = "${ArticleId}" AND favoriteListId = "${UserFavId}"`)
  return ArticleDelete;
}