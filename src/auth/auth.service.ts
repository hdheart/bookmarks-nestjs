import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable({})
export class authService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    //generate the password hash
    const hash = await argon.hash(dto.password);

    //save the new user i n the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: 'h',
          lastName: 'dh',
        },
        select: {
          id: true,
          email: true,
          createAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credentials taken');
        }
        throw error;
      }
    }
  }
  async signin(dto: AuthDto) {
    //find user in the db
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) {
        throw new ForbiddenException('用户名错误');
      }
      const pwMatches = await argon.verify(user.hash, dto.password);

      if (!pwMatches) {
        throw new ForbiddenException('credentials incorrent');
      }
      return this.signToken(user.id, user.email);
    } catch (error) {
      throw error;
    }
  }
    async signToken(userId: number, email: string): Promise<{access_token: string}> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token =  await this.jwt.signAsync(payload, {
        expiresIn: '60m',
        secret: secret,
      });
    return {
        access_token: token
    }
  }
}
