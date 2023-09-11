import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, UpdateDateColumn, CreateDateColumn, ArrayContainedBy, OneToMany } from "typeorm"
import { User } from './User';
import { FleaMarket } from './FleaMarket';

@Entity()
export class UserFleamarket {

    @PrimaryGeneratedColumn()
    private id: number

    @Column({ nullable: true })
    private position: string

    @ManyToOne(() => User, (user) => user.userFleamarkets)
    public user: User;

    @ManyToOne(() => FleaMarket, (fleaMarket) => fleaMarket.userFleamarkets)
    public fleaMarket: FleaMarket;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private updated_at: Date;

    @Column({ default: 0 })
    private status: number

    public getId(): number {
        return this.id
    }
    public getPosition(): string {
        return this.position
    }
    public setPosition(position: string): string {
        return this.position = position;
    }
    public getStatus(): number {
        return this.status
    }
    public setStatus(status: number): number {
        return this.status = status;
    }
    public getCreatedAt(): Date {
        return this.created_at
    }
    public setCreatedAt(created_at: Date): Date {
        return this.created_at = created_at;
    }
    public getUpdatedAt(): Date {
        return this.updated_at
    }
    public setUpdatedAt(updated_at: Date): Date {
        return this.updated_at = updated_at;
    }
    public getFleaMarket(): FleaMarket {
        return this.fleaMarket;
    }
    public setFleaMarket(FleaMarket: FleaMarket) {
        this.fleaMarket = FleaMarket;
    }
    public getUser(): User {
        return this.user;
    }
    public setUser(User: User) {
        this.user = User;
    }
}