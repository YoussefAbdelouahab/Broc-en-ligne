import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Delete,
  Patch,
  Res,
} from "routing-controllers";
import { AppDataSource } from "../db/data-source";
import { User, UserRole } from "../entity/User";
import { FavoriteList } from "../entity/FavoriteList";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { Response } from "express";
import { Article } from "../entity/Article";
import * as fs from "fs";
import * as path from "path";
import { NodeMailerSendEmail } from "../email/NodeMailerSendEmail"
import { UserRepository } from "../repository/UserRepository";


@JsonController()
export class UserController {
  private mailer = new NodeMailerSendEmail();

  constructor(private userRepository, private articleRepository, private favoritelistRepository) {
    this.userRepository = AppDataSource.getRepository(User);
    this.articleRepository = AppDataSource.getRepository(Article);
    this.favoritelistRepository = AppDataSource.getRepository(FavoriteList);
  }


  @Post("/contact")
  public async contact(@Body() data, @Res() res: Response) {
    try {
      console.log(data);
      await this.mailer.sendMailConfirmConfirmContact(data["usermail"], `Broc en ligne :  Votre demande a bien été prise en compte`);

      await this.mailer.sendMailConfirmConfirmSupport(data["usermail"], `Broc en ligne :  ${data["usermail"]} à contacté le support`,
        data["rubrique"], data["raison"], data["role"], data["object"], data["message"]);

      return res.status(200).json({ success: "ok" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Post("/register")
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
      user.setRole(UserRole.USER);

      await this.userRepository.save(user);

      const favoriteList = new FavoriteList();
      favoriteList.user = user;
      await this.favoritelistRepository.save(favoriteList);

      await this.mailer.sendMailRegister(user.getMail(), "Broc en ligne : votre inscription est un succès !", user.getUsername());

      return res.status(200).json({ success: "Account created" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Post("/login")
  public async login(@Body() data: User, @Res() res: Response) {
    try {
      // find object in data source
      const user: User = await this.userRepository.findOne({ where: { mail: data.getMail() } });
      if (!user) throw new Error("Account not found");

      // check if password conform
      const isValid = await bcrypt.compare(data.getPassword(), user.getPassword());
      if (!isValid) throw new Error("Identifiant/password incorrect");

      const token = jwt.sign(
        {
          id: user.getId(),
          username: user.getUsername(),
          role: user.getRole(),
        },
        "bc042227-9f88-414d",
        {
          expiresIn: "24h",
        }
      );

      if (!token) throw new Error("Error authentication");

      return res.status(200).json({ success: "Account login", token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/user/:id")
  public async getOneById(@Param("id") id: string, @Res() res: Response) {
    try {
      const user: User = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new Error("Account not found");
      return user;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/user/username/:username")
  public async getOneByUsername(@Param("username") username: string, @Res() res: Response) {
    try {
      const user: User = await this.userRepository.findOne({ where: { username } });
      if (!user) throw new Error("Account not found");
      return user;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/users")
  public async getAll(@Res() res: Response) {
    try {
      const users: User[] = await this.userRepository.find({
        order: { id: "DESC" },
      });
      if (!users) throw new Error("Users not found");
      return users;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Get("/users/count")
  public async getCountUser(
    @Res() res: Response
  ) {
    try {
      const count: User = await this.userRepository
        .createQueryBuilder("user")
        .getCount();

      if (!count) return 0;

      return count;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Patch("/user/:id")
  public async update(
    @Param("id") id: string,
    @Body() data: User,
    @Res() res: Response
  ) {
    try {
      const user = new UserRepository();
      const userUpdate = await user.updateUser(id, data);;

      const token = jwt.sign(
        {
          id: userUpdate.getId(),
          username: userUpdate["username"],
          roles: userUpdate["role"],
        },
        "bc042227-9f88-414d",
        {
          expiresIn: "24h",
        }
      );

      if (!token) throw new Error("Error authentication");

      return res.status(200).json({ success: "Votre profil a été mis à jour avec succès.", token });

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Delete("/user/:id")
  public async remove(
    @Param("id") id: string,
    @Res() res: Response,
  ) {
    try {
      const user: User = await this.userRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.article", "article")
        .leftJoinAndSelect("article.file", "file")
        .where({ id: id })
        .orderBy("article.created_at", "DESC")
        .getOne();

      const userHasRemove = await this.userRepository.remove(user);

      if (!userHasRemove) throw new Error("User not remove correctly");

      // récupère la liste des URL de fichiers à supprimer
      const filesToDelete = await user.article.flatMap(article =>
        article.file.map(file => file.getUrl())
      );

      filesToDelete.forEach(url => {
        const filePath = path.join(__dirname, "..", "..", "..", "broc-en-ligne_react", "src", "media", url);
        fs.unlinkSync(filePath); // supprime le fichier
      });


      await this.mailer.sendMailRemoveUser(user.getMail(), "Broc en ligne : on espère vous revoir bientôt !", user.getUsername());

      return res.status(200).json({ success: "Account deleted" });

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Patch("/user/updatePassword/:userId")
  public async updatePassword(
    @Param("userId") userId: string,
    @Body() data: any,
    @Res() res: Response
  ) {
    try {
      const user: User = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) throw new Error("Account not found");

      // check if password conform
      const isValid = await bcrypt.compare(
        data.oldPassword,
        user.getPassword()
      );
      if (!isValid) throw new Error("Incorrect current password");

      // hash password
      const hash = await bcrypt.hash(data.newPassword, 10);

      user.setPassword(hash);

      await this.userRepository.save(user);

      await this.mailer.sendMailConfirmUpdatePassword(user.getMail(), "Broc en ligne : votre mot de passe a été modifié", user.getUsername());

      return res.status(200).json({ success: "Password updated." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Post("/requestForgotPassword")
  public async requestForgotPassword(
    @Body() data: User,
    @Res() res: Response
  ) {
    try {
      const user: User = await this.userRepository.findOne({
        where: { mail: data.getMail() },
      });
      if (!user) throw new Error("Account not found");

      let token = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(token, 10);

      const resetToken = hash;

      // url page reset password send with mail
      const link = `reinitialiser-mdp?token=${token}&id=${user.getId()}`;

      await this.mailer.sendMailForgotPassword(user.getMail(), "Broc en ligne : réinitialisez votre mot de passe ", user.getUsername(), link);

      return res.status(200).json({ success: "Mail sent", resetToken });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Patch("/resetPassword")
  public async resetPassword(
    @Body() data: any,
    @Res() res: Response
  ) {
    try {
      let passwordResetToken = data.resetToken;
      if (!passwordResetToken)
        throw new Error("Invalid or expired password reset token");

      const isValid = await bcrypt.compare(data.token, passwordResetToken);
      if (!isValid) throw new Error("Invalid or expired password reset token");

      const hash = await bcrypt.hash(data.password, 10);

      const user: User = await this.userRepository.findOne({
        where: { id: data.id },
      });
      if (!user) throw new Error("Account not found");

      user.setPassword(hash);

      await this.userRepository.save(user);

      await this.mailer.sendMailConfirmResetPassword(user.getMail(), "Broc en ligne : votre mot de passe a bien été réinitialisé", user.getUsername());

      return res.status(200).json({ success: "Password reset. Please login !" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
