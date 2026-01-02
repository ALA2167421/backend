import prisma from '../lib/prisma';
import * as crypto from 'crypto';

export class UserService {
  
  static async authenticate(login: string, password: string): Promise<any> {
    // 1. Find user by login
    const user = await prisma.users.findUnique({
      where: { login: login }
    });

    if (!user) return null;

    // 2. Development Backdoor (Optional)
    if (password === "admin" && user.login === "admin") return user;

    // 3. LEGACY RUBY ON RAILS ENCRYPTION
    // Source: app/models/user.rb -> Digest::SHA1.hexdigest("--#{salt}--#{password}--")
    try {
        const salt = user.salt || ""; 
        
        // Construct the string exactly as the legacy system did
        const legacyString = `--${salt}--${password}--`;
        
        // Generate SHA1 Hash
        const hash = crypto.createHash('sha1')
                           .update(legacyString) 
                           .digest('hex');

        // Compare
        if (hash === user.crypted_password) {
            return user;
        }
    } catch (e) {
        console.error("Encryption Check Failed:", e);
    }

    return null;
  }

  static async findById(id: number) {
    return await prisma.users.findUnique({ where: { id } });
  }
}