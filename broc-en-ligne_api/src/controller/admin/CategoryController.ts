import { Body, Delete, Get, JsonController, Param, Patch, Post, UseBefore, Req, Res } from "routing-controllers";
import { AppDataSource } from "../../db/data-source";
import { Category } from "../../entity/Category";
import { Authentification } from "../../middleware/auth";
import { Authorisation } from "../../middleware/permission";
import { Response } from "express";

@JsonController()
export class CategoryController {

    constructor(private categoryRepository) {
        this.categoryRepository = AppDataSource.getRepository(Category);
    }

    @Get('/categories')
    public async getAll(@Res() res: Response) {
        try {
            const categories: Category[] = await this.categoryRepository.find({ order: { id: "DESC" }, relations: ["children", "articles"] });
            if (!categories) throw new Error('Categories not found');

            return categories;

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Get('/category/:id')
    public async getOne(@Param('id') id: number, @Res() res: Response) {
        try {
            const category = await this.categoryRepository.findOne({ where: { id }, relations: ["children"] });
            if (!category) throw new Error('Category not found');

            return category;

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Post('/category')
    @UseBefore(Authorisation)
    public async post(@Body() data: Category, @Res() res: Response) {
        try {
            const isExit: Category = await this.categoryRepository.findOne({ where: { title: data.getTitle() } });
            if (isExit) throw new Error('Category existing');

            const category: Category = data;
            if (!category) throw new Error('Category not created');

            await this.categoryRepository.save(category);

            return res.status(200).json({ success: "Category created" });

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Patch('/category/:id')
    @UseBefore(Authorisation)
    public async update(@Param('id') id: number, @Body() data: Category, @Req() req: any, @Res() res: Response) {
        try {
            const category: Category = await this.categoryRepository.findOne({ where: { id } });
            if (!category) return { error: 'Category not found' };

            await this.categoryRepository.save({ ...category, ...data });

            return res.status(200).json({ success: "Category updated" });

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Delete('/category/:id')
    @UseBefore(Authorisation)
    public async remove(@Param('id') id: number, @Res() res: Response) {
        try {
            const category: Category = await this.categoryRepository.findOne({ where: { id } });
            if (!category) return { error: 'Category not found' };

            await this.categoryRepository.remove(category);

            return res.status(200).json({ success: "Category deleted" });

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}