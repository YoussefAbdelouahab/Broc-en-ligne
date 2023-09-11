import {
    JsonController,
    Param,
    Body,
    Get,
    Post,
    Patch,
    Delete, UseBefore, Req, Res
} from 'routing-controllers';
import { AppDataSource } from '../../db/data-source';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { User, UserRole } from "../../entity/User";
import { NodeMailerSendEmail } from "../../email/NodeMailerSendEmail";
import { Authentification } from "../../middleware/auth";
import { Authorisation } from "../../middleware/permission";
import { Response } from 'express';
import { Article } from '../../entity/Article';
import * as fs from "fs";
import * as path from "path";

@JsonController()
export class AdminController {
    constructor(private userRepository, private articleRepository) {
        this.userRepository = AppDataSource.getRepository(User);
        this.articleRepository = AppDataSource.getRepository(Article);
    }

    @Post("/admin/register")
    @UseBefore(Authorisation)
    public async register(@Body() data: User, @Res() res: Response) {
        try {
            // verif object existing in data source
            const hasAccountWithEmail: User = await this.userRepository.findOne({
                where: { mail: data.getMail() },
            });
            const hasAccountWithUsername: User = await this.userRepository.findOne({
                where: { username: data.getUsername() },
            });
            if (hasAccountWithEmail || hasAccountWithUsername)
                throw new Error("Account existing. Please Login");

            // hash password
            const hash = await bcrypt.hash(data.getPassword(), 10);

            // create object with condition
            const user: User = data;
            if (!user) throw new Error("Account not created");
            user.setPassword(hash);

            await this.userRepository.save(user);


            return res.status(200).json({ success: "Account created" });

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // @Patch('/admin/:id/:username')
    // @UseBefore(Authentification)
    // @UseBefore(Authorisation)
    // public async update(@Param('id') id: string, @Param('username') username: string, @Body() data: Admin, @Req() req: any, @Res() res: Response) {
    //     try {
    //         const authId = req.auth.id;
    //         const authRoles = req.auth.roles;
    //         if (id != authId || authRoles != "ADMIN") throw new Error('Unauthorized');

    //         const admin: Admin = await this.adminRepository.findOne({ where: { id, username } });
    //         if (!admin) throw new Error('Account not found');

    //         await this.adminRepository.save({ ...admin, ...data });

    //         return res.status(200).json({ success: "Account updated" });

    //     } catch (error) {
    //         return res.status(400).json({ error: error.message });
    //     }
    // }

    // @Delete('/admin/:id/:username')
    // @UseBefore(Authentification)
    // @UseBefore(Authorisation)
    // public async remove(@Param('id') id: string, @Param('username') username: string, @Req() req: any, @Res() res: Response) {
    //     try {
    //         const authId = req.auth.id;
    //         const authRoles = req.auth.roles;
    //         if (id != authId || authRoles != "ADMIN") throw new Error('Unauthorized');

    //         const admin: Admin = await this.adminRepository.findOne({ where: { id, username } });
    //         if (!admin) throw new Error('Account not found');

    //         await this.adminRepository.remove(admin);

    //         req.session.destroy();

    //         return res.status(200).json({ success: "Account deleted" });

    //     } catch (error) {
    //         return res.status(400).json({ error: error.message });
    //     }
    // }

}