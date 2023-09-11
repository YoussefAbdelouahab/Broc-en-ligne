import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm"
import { Article } from "./Article";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    private id: number

    @Column()
    private title: string

    @Column({ nullable: true })
    private id_parent: number | null = null;

    @CreateDateColumn()
    private created_at: Date

    @UpdateDateColumn()
    private updated_at: Date

    @OneToMany(() => Category, category => category.parent)
    children: Category[];

    @ManyToOne(() => Category, category => category.children)
    @JoinColumn({ name: "id_parent" })
    parent: Category;

    @OneToMany(() => Article, (article) => article.category)
    public articles: Article[];

    constructor(title: string) {
        this.title = title;
    }

    public getId(): number {
        return this.id;
    }
    public getTitle(): string {
        return this.title;
    }
    public setTitle(title: string): void {
        this.title = title;
    }
    public getId_parent(): number {
        return this.id_parent;
    }
    public setId_parent(id_parent: number): void {
        this.id_parent = id_parent;
    }
    public getCreated_at(): Date {
        return this.created_at;
    }
    public getUpdated_at(): Date {
        return this.updated_at;
    }

    getChildren(): Category[] {
        return this.children;
    }

    getParent(): Category {
        return this.parent;
    }

}
