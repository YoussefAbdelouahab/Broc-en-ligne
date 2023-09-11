import { AppDataSource } from "../db/data-source";
import { User } from "../entity/User";

export class UserRepository {

    private userRepository;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);;
    }

    public async updateUser(id: string, data: User): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: id } });

        if (!user) throw new Error("User not found");

        // Apply the updates to the user object
        Object.assign(user, data);

        // Save the updated user object to the database
        const updatedUser = await this.userRepository.save(user);

        return updatedUser;
    }
}

