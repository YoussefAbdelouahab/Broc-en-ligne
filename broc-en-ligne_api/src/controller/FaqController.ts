import { Body, Delete, Get, JsonController, Param, Patch, Post, Req, Res, UseBefore } from 'routing-controllers';
import { AppDataSource } from '../db/data-source';
import { Faq } from '../entity/Faq';
import { Response } from 'express';
import { Authorisation } from '../middleware/permission';
import { Between, MoreThan, MoreThanOrEqual, Not } from 'typeorm';

@JsonController()
export class FaqController {

    constructor(private readonly faqRepository) {
        this.faqRepository = AppDataSource.getRepository(Faq);
    }

    @Get('/faq')
    public async getAll(@Res() res: Response) {
        try {
            const faqs: Faq[] = await this.faqRepository.find({ order: { order: 'ASC' } });
            if (!faqs) {
                throw new Error('Faq not found');
            }

            return faqs;

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Get('/faq/:id')
    public async getOne(@Param('id') id: number, @Res() res: Response) {
        try {
            const faq: Faq = await this.faqRepository.findOne({ where: { id } });
            if (!faq) {
                return res.status(400).json({ error: 'Question non trouvée' });
            }

            return faq;

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Post('/faq')
    @UseBefore(Authorisation)
    public async post(@Body() data: Faq, @Res() res: Response) {
        try {
            const isExist: Faq = await this.faqRepository.findOne({ where: { question: data.getQuestion() } });
            if (isExist) {
                throw new Error('Question déjà existante');
            }

            const faq: Faq = data;
            if (!faq) {
                throw new Error('Question non créée');
            }

            let createdFaq: Faq = await this.faqRepository.save(faq);

            const questionsToUpdate: Faq[] = await this.faqRepository.find(
                {
                    where: {
                        order: MoreThanOrEqual(createdFaq.getOrder()),
                        id: Not(createdFaq.getId())
                    },
                    order: { order: 'ASC' }
                }
            );
            for (const question of questionsToUpdate) {
                question.setOrder(question.getOrder() + 1);
                await this.faqRepository.save(question);
            }

            return res.status(200).json({ success: 'Question créée' });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Patch('/faq/:id')
    @UseBefore(Authorisation)
    public async update(@Param('id') id: number, @Body() data: Faq, @Res() res: Response) {
        try {
            const faq: Faq = await this.faqRepository.findOne({ where: { id } });
            if (!faq) {
                return res.status(400).json({ error: 'Question non trouvée' });
            }

            const initialOrder = faq.order;
            const updatedFaq: Faq = await this.faqRepository.save({ ...faq, ...data });

            if (updatedFaq.order !== initialOrder) {
                const questionsToUpdate: Faq[] = await this.faqRepository.createQueryBuilder('faq')
                    .where('faq.id != :id', { id: updatedFaq.id })
                    .andWhere('faq.order >= :minOrder', { minOrder: Math.min(initialOrder, updatedFaq.order) })
                    .andWhere('faq.order <= :maxOrder', { maxOrder: Math.max(initialOrder, updatedFaq.order) })
                    .orderBy('faq.order', 'ASC')
                    .getMany();

                for (const question of questionsToUpdate) {
                    if (question.id === updatedFaq.id) {
                        question.order = updatedFaq.order;
                    } else if (updatedFaq.order < initialOrder) {
                        question.order++;
                    } else {
                        question.order--;
                    }
                    await this.faqRepository.save(question);
                }
            }

            return res.status(200).json({ success: 'Question mise à jour' });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Delete('/faq/:id')
    @UseBefore(Authorisation)
    public async remove(@Param('id') id: number, @Res() res: Response) {
        try {
            const faq: Faq = await this.faqRepository.findOne({ where: { id } });
            if (!faq) {
                return res.status(400).json({ error: 'Question non trouvée' });
            }

            const order = faq.order;
            await this.faqRepository.remove(faq);

            const questionsToUpdate: Faq[] = await this.faqRepository.find({ where: { order: MoreThan(order) } });
            for (const question of questionsToUpdate) {
                question.order--;
                await this.faqRepository.save(question);
            }

            return res.status(200).json({ success: 'Question supprimée' });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

}
