import prisma from './base.service';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export class UserService {

  // Simulate Ruby's Digest::SHA1.hexdigest("--#{salt}--#{password}--")
  private static encrypt(password: string, salt: string): string {
    const hash = crypto.createHash('sha1');
    hash.update(`--${salt}--${password}--`);
    return hash.digest('hex');
  }

  static async authenticate(login: string, password: string) {
    const user = await prisma.users.findUnique({ where: { login } });
    if (!user || !user.salt || !user.crypted_password) return null;

    const encrypted = this.encrypt(password, user.salt);
    if (encrypted === user.crypted_password) {
      return user;
    }
    return null;
  }

  static async create(data: any) {
    const salt = crypto.createHash('sha1').update(`--${new Date()}--${data.login}--`).digest('hex');
    const crypted_password = this.encrypt(data.password, salt);

    return await prisma.users.create({
      data: {
        uuid: uuidv4(),
        login: data.login,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        salt: salt,
        crypted_password: crypted_password,
        status: 'A', // Active
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
