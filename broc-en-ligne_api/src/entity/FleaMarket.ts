import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn, CreateDateColumn, OneToMany } from "typeorm"
import { Localisation } from './Localisation';
import { UserFleamarket } from "./UserFleaMarket";
@Entity()
export class FleaMarket {

    @PrimaryGeneratedColumn()
    private id: number

    @Column()
    private event_id: number

    @Column()
    private title: string

    @Column()
    private event_date: Date

    @Column()
    private address: string

    @Column({ nullable: true })
    private exhibitor_hours: string

    @Column({ nullable: true })
    private visitor_hours: string

    @Column({ nullable: true })
    private exhibitor_count: string

    @Column({ nullable: true })
    private type: string

    @Column({ nullable: true })
    private price: string

    @Column({ nullable: true })
    private layout: string

    @Column({ nullable: true })
    private exhibitor_type: string

    @Column({
        nullable: true,
        length: 5000
    })
    private description: string

    @CreateDateColumn()
    private created_at: Date

    @UpdateDateColumn()
    private updated_at: Date

    @Column({ default: 0 })
    private status: number

    @ManyToOne(type => Localisation)
    @JoinColumn()
    private localisation: Localisation;

    //link to User through middle table UserFleamarket
    @OneToMany(() => UserFleamarket, (userFleamarket) => userFleamarket.fleaMarket)
    public userFleamarkets: UserFleamarket[];

    constructor(event_id: number, title: string, event_date: Date, address: string, exhibitor_hours: string,
        visitor_hours: string, type: string) {
        this.event_id = event_id;
        this.title = title;
        this.event_date = event_date;
        this.address = address;
        this.exhibitor_hours = exhibitor_hours;
        this.visitor_hours = visitor_hours;
        this.type = type;
    }


    public getId(): number {
        return this.id;
    }

    public getEvent_Id(): number {
        return this.event_id;
    }
    public setEvent_Id(event_id: number): void {
        this.event_id = event_id;
    }
    public getTitle(): string {
        return this.title;
    }
    public setTitle(title: string): void {
        this.title = title;
    }
    public getEvent_date(): Date {
        return this.event_date;
    }
    public setEvent_date(event_date: Date): void {
        this.event_date = event_date;
    }
    public getAddress(): string {
        return this.address;
    }
    public setAddress(Address: string): void {
        this.address = Address;
    }
    public getExhibitor_hours(): string {
        return this.exhibitor_hours;
    }
    public setExhibitor_hours(exhibitor_hours: string): void {
        this.exhibitor_hours = exhibitor_hours;
    }
    public getVisitor_hours(): string {
        return this.visitor_hours;
    }
    public setVisitor_hours(visitor_hours: string): void {
        this.visitor_hours = visitor_hours;
    }
    public getExhibitor_count(): string {
        return this.exhibitor_count;
    }
    public setExhibitor_count(exhibitor_count: string): void {
        this.exhibitor_count = exhibitor_count;
    }
    public getType(): string {
        return this.type;
    }
    public setType(type: string): void {
        this.type = type;
    }
    public getPrice(): string {
        return this.price;
    }
    public setPrice(price: string): void {
        this.price = price;
    }
    public getLayout(): string {
        return this.layout;
    }
    public setLayout(layout: string): void {
        this.layout = layout;
    }
    public getExhibitorType(): string {
        return this.exhibitor_type;
    }
    public setExhibitorType(exhibitor_type: string): void {
        this.exhibitor_type = exhibitor_type;
    }
    public getDescription(): string {
        return this.description;
    }
    public setDescription(description: string): void {
        this.description = description;
    }
    public getStatus(): number {
        return this.status;
    }
    public setStatus(status: number): void {
        this.status = status;
    }
    public getCreated_at(): Date {
        return this.created_at;
    }
    public getUpdated_at(): Date {
        return this.updated_at;
    }
    public getLocalisation(): Localisation {
        return this.localisation;
    }
    public setLocalisation(Localisation: Localisation) {
        this.localisation = Localisation;
    }
    public getUserFleaMarket(): UserFleamarket[] {
        return this.userFleamarkets
    }
    public setUserFleamarket(userFleamarkets: UserFleamarket[]) {
        this.userFleamarkets = userFleamarkets;
    }

}
