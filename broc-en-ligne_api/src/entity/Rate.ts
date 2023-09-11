import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, UpdateDateColumn, CreateDateColumn, ArrayContainedBy, OneToMany } from "typeorm"
import { User } from './User';



@Entity()
export class Rate {
    @PrimaryGeneratedColumn("uuid")
    private id: number

    @Column()
    private scoring_user: string

    @Column()
    private score: number

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private updated_at: Date;

    @ManyToOne(type => User) // Init many to one relation with User
    @JoinColumn()
    user: User; // Join user table with Article table

    constructor(scoring_user: string, score: number, price: number) {
        this.scoring_user = scoring_user;
        this.score = score;
    }

    public getId(): number {
        return this.id;
    }
    public getScoring_user(): string {
        return this.scoring_user;
    }
    public setScoring_user(scoring_user: string): void {
        this.scoring_user = scoring_user;
    }
    public getScore(): number {
        return this.score;
    }
    public setScore(score: number): void {
        this.score = score;
    }
    public getCreated_at(): Date {
        return this.created_at;
    }
    public getUpdated_at(): Date {
        return this.updated_at;
    }
    //Getters et setters de relations
    public getUser(): User {
        return this.user;
    }
    public setUser(User: User) {
        this.user = User;
    }
}
