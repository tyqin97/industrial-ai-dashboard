import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo : Repository<User>) {}

    findByEmail(email : string) {
        return this.repo.findOne({ where : { email }});
    }

    create(email : string, password_hash : string, role = 'engineer') {
        const u = this.repo.create({ email, password_hash, role });
        return this.repo.save(u);
    }
}