import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from './user.entity';

@Injectable()       // Make class available for DI
export class UsersService {
    /*
        @InjectRepository(User) asks Nest to give us a TypeORM Repository<User>
        connected to the same DB from app.module.ts.
    */
    constructor(@InjectRepository(User) private repo : Repository<User>) {}

    async findByEmail(email : string) {
        const user = await this.repo.findOne({ where : { email }});
        
        if (!user) {
            throw new NotFoundException(`User with email "${email}" not found.`);
        }
        return user;
    }

    create(email : string, password_hash : string, role = 'engineer') {
        // .create only makes an entity instance in memory (does not persist)
        const u = this.repo.create({ email, password_hash, role });
        // .save INSERTs (or UPDATEs if entity has an id)
        return this.repo.save(u);
    }
}