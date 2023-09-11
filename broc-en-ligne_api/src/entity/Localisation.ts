import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne } from "typeorm"
import { Article } from './Article';
import { User } from './User';

@Entity()
export class Localisation {

    @PrimaryGeneratedColumn()
    private id: number

    @Column()
    private zip_code: number

    @Column()
    private city: string

    constructor(zip_code: number, city: string) {
        this.zip_code = zip_code;
        this.city = city;
    }


    public getId(): number {
        return this.id;
    }
    public getZip_code(): number {
        return this.zip_code;
    }
    public setZip_code(zip_code: number): void {
        this.zip_code = zip_code;
    }
    public getCity(): string {
        return this.city;
    }
    public setCity(city: string): void {
        this.city = city;
    }
}
