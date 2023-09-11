import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, CreateDateColumn } from "typeorm"
import { User } from './User';
import { Article } from "./Article";

@Entity()
export class FavoriteList {

    @PrimaryGeneratedColumn()
    private id: number


    @OneToOne(() => User, { persistence: false }) // Init one to one relation with User
    @JoinColumn() // Join user table with FavoriteList table
    public user: User

    @ManyToMany(() => Article, { cascade: true, onDelete: "CASCADE" }) // Init many to many relation with FavoriteList
    @JoinTable({
        name: "article_favoritelist",
        joinColumn: { name: "favoriteListId" },
        inverseJoinColumn: { name: "articleId" },
    })

    private article: Article[] // Join FavoriteList table with Article table

    public getId(): number {
        return this.id;
    }
    public getUser(): User {
        return this.user;
    }
    public setUser(User: User) {
        this.user = User;
    }
    public getFavoriteList(): Article[] {
        return this.article;
    }
    public setFavoriteList(FavoriteList: Article[]) {
        this.article = FavoriteList;
    }
}
