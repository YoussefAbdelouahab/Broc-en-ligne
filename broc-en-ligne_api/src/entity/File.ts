import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { Article } from './Article';

@Entity()
export class File {
    forEach(arg0: (element: any) => void) {
        throw new Error('Method not implemented.');
    }

    @PrimaryGeneratedColumn()
    private id: number

    @Column({ unique: true })
    private url: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private updated_at: Date;

    @ManyToOne(type => Article, { onDelete: 'CASCADE' }) // Init many to one relation with Article
    @JoinColumn()
    article: Article; // Join article table with File table

    constructor(url: string, created_at: Date, updated_at: Date) {
        this.url = url;
    }

    public getId(): number {
        return this.id;
    }
    public getUrl(): string {
        return this.url;
    }
    public setUrl(Url: string): void {
        this.url = Url;
    }
    public getCreated_at(): Date {
        return this.created_at;
    }
    public getUpdated_at(): Date {
        return this.updated_at;
    }
    public getArticle(): Article {
        return this.article;
    }
    public setArticle(Article: Article): void {
        this.article = Article;
    }
}