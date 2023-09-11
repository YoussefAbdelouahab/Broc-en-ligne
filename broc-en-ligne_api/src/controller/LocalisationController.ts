import { JsonController, Get} from 'routing-controllers';
import { AppDataSource } from '../db/data-source';
import { Localisation } from '../entity/Localisation';

@JsonController()
export class FlearMarketController {

    constructor(private localisationRepository) {
        this.localisationRepository = AppDataSource.getRepository(Localisation);
    }

    @Get('/localisation')
    public async getAll() {
        try {
            const localisation: Localisation = await this.localisationRepository.find();
            if (!localisation) throw new Error('Localisation not found')
            return localisation;
        } catch (error) {
            return { error: error.message }
        }
    }
}