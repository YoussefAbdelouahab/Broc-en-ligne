import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Faq {

    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    private question: string;

    @Column()
    private answer: string;

    @Column()
    order: number;

    constructor(question: string, answer: string, order: number) {
        this.question = question;
        this.answer = answer;
        this.order = order;
    }

    public getId(): number {
        return this.id;
    }

    public getQuestion() {
        return this.question;
    }

    public setQuestion(question: string): void {
        this.question = question;
    }

    public getAnswer() {
        return this.answer;
    }

    public setAnswer(answer: string): void {
        this.answer = answer;
    }

    public getOrder() {
        return this.order;
    }

    public setOrder(order: number): void {
        this.order = order;
    }
}
