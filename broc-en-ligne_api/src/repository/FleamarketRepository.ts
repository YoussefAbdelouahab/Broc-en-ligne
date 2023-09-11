import { FleaMarket } from "../entity/FleaMarket";
import { AppDataSource } from "../db/data-source";

export function getFleamarketsTypes() {
    const types = AppDataSource.createQueryBuilder()
        .select("type")
        .from(FleaMarket, "flea_market")
        .distinct(true)
        .execute();
    return types
}
