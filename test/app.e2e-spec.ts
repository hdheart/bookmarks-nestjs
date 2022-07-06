import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('App, e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(async () => {
    await app.close();
  });
  it.todo('should pass');

  describe('Auth', () => {
    const dto: AuthDto = {
      email: '146@qq.com',
      password: '123',
    };
    describe('SignUp', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto.password)
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto.email)
          .expectStatus(400);
      });
      it('should signUp', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto.password)
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto.email)
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAT', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get curent user', () => {
        return pactum.spec().get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAT}'
        })
        .expectStatus(200)
      });
    });
    describe('Edit user', () => {
      const dto: EditUserDto = {
        email: '123@qq.com'
      }
      it('should edit user', () => {
        return pactum.spec()
        .patch('/users/edit')
        .withBody(dto)
        .withHeaders({
          Authorization: 'Bearer $S{userAT}'
        })
        .expectStatus(200)
        .expectBodyContains(dto.email)
      });
    });
  });
  describe('Bookmarks', () => {
    describe('create bookMarks', () => {});
    describe('get bookMarks', () => {});
    describe('get bookMarks by id', () => {});
    describe('get bookMarks', () => {});
    describe('delete bookMarks', () => {});
  });
});
