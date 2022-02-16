import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  // [x] ORM
  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne(
      user_id, 
      { relations: ["games"] }// para fazer um join das relações com a tabela games
    );

    if (!user) {
      throw new Error("User does not exist!");
    }

    return user;
  }

  // [x] raw query
  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`
      SELECT * 
      FROM users 
      ORDER BY  first_name, last_name
      `);
  }

  // [x] raw query
  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
      SELECT * 
      FROM users 
      WHERE LOWER (first_name) = LOWER('${first_name}') 
        AND LOWER (last_name) = LOWER('${last_name}')
    `); 
  }
}
