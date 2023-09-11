import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { Article } from './Article';
import { User } from './User';
import { FleaMarket } from './FleaMarket';

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn()
    private id: number

    @Column()
    private delivery_hour: string

    @CreateDateColumn()
    private created_at: Date

    @UpdateDateColumn()
    private updated_at: Date

    @Column()
    private status: number

    @OneToOne(() => Article) // Init one to one relation with Article
    @JoinColumn() // Join Reservation, table with Article table
    private article: Article

    @ManyToOne(() => FleaMarket) // Init one to one relation with Article
    @JoinColumn() // Join Reservation, table with Article table
    private fleamarket: FleaMarket

    @ManyToOne(() => User) // Init many to one relation with User
    @JoinColumn()
    private userExposant: User;

    @ManyToOne(() => User) // Init many to one relation with User
    @JoinColumn()
    private userVisitor: User;

    public getId(): number {
        return this.id;
    }
    public getDelivery_hour(): string {
        return this.delivery_hour;
    }
    public setDelivery_hour(delivery_hour: string): void {
        this.delivery_hour = delivery_hour;
    }
    public getCreated_at(): Date {
        return this.created_at;
    }
    public getUpdated_at(): Date {
        return this.updated_at;
    }
    public getStatus(): number {
        return this.status;
    }
    public setStatus(status: number): void {
        this.status = status;
    }

    public getArticle(): Article {
        return this.article;
    }
    public setArticle(article: Article) {
        this.article = article;
    }
    public getFleamarket(): FleaMarket {
        return this.fleamarket;
    }
    public setFleamarket(fleamarket: FleaMarket) {
        this.fleamarket = fleamarket;
    }
    public getUserExposant(): User {
        return this.userExposant;
    }
    public setUserExposant(user: User) {
        this.userExposant = user;
    }
    public getUserVisitor(): User {
        return this.userVisitor;
    }
    public setUserVisitor(user: User) {
        this.userVisitor = user;
    }
}
