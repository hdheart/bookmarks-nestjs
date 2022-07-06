import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }
  getBookmarkById(userId: number, bookmarkId: number) {}
  createBookmarkById(userId: number, dto: CreateBookmarkDto) {}
  editBookmarkById(userId: number, dto: EditBookmarkDto) {}
  deleteBookmarkById(userId: number) {}
}
