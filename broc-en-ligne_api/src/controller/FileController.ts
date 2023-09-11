import { Delete, Get, JsonController, Param, Res } from "routing-controllers";
import { AppDataSource } from "../db/data-source";
import { File } from "../entity/File";
import { Response } from "express";
import * as fs from "fs";
import * as path from "path";

@JsonController()
export class FileController {
    constructor(
        public fileRepository
    ) {
        this.fileRepository = AppDataSource.getRepository(File);
    }

    @Get("/files")
    public async getAll(@Res() res: Response) {
        try {
            const files: File[] = await this.fileRepository.find({
                order: { id: "DESC" },
            });
            if (!files) throw new Error("Files not found");
            return files;
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Delete('/files/:id')
    public async deleteArticle(@Param('id') id: string, @Res() res: Response) {
        try {
            const file: File = await this.fileRepository.findOne({ relations: ['article'], where: { id: id } });
            if (!file) throw new Error('file not found');

            const filePath = path.join(__dirname, "..", "..", "..", "broc-en-ligne_react", "src", "media", file.getUrl());
            fs.unlinkSync(filePath); // supprime le fichier

            await this.fileRepository.remove(file);

            return res.status(200).json({ success: "file deleted" });

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}