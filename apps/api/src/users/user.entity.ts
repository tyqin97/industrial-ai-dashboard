import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name : 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({ unique : true })
    email : string;

    @Column()
    password_hash : string;

    @Column({ default : 'engineer' })
    role : string;
}