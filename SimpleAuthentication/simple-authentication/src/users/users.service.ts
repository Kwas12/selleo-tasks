import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/createUser.dto';
import * as argon2 from 'argon2';
import { LoginDTO } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<Partial<User>> {
    const user = await this.findOne(userDTO);
    if (user) {
      throw new ConflictException('User Exists');
    }
    userDTO.password = await argon2.hash(userDTO.password);
    const newUser = (await this.userRepository.save(userDTO)) as Partial<User>;
    delete newUser.password;
    delete newUser.refreshToken;
    return newUser;
  }

  async findOne(userDTO: LoginDTO): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email: userDTO.email });

    return user;
  }

  async findOneById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }

  async updateToken(userId: string, token: string): Promise<UpdateResult> {
    const hashedRefreshToken = await argon2.hash(token);
    return this.userRepository.update(
      { id: userId },
      { refreshToken: hashedRefreshToken },
    );
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phoneNumber',
        'shirtSize',
        'preferredTechnology',
      ],
    });
  }
}
