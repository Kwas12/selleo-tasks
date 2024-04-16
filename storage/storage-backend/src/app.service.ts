import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  promises,
  existsSync,
  mkdirSync,
  statSync,
  createReadStream,
} from 'fs';
import { File } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddDirectoryDTO } from './dto/AddDirectory.dto';
import { join } from 'path';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async saveFiles(
    files: Express.Multer.File[],
    directory: string,
    role: string,
  ) {
    try {
      if (!existsSync(`${__dirname}/files/`)) {
        mkdirSync(`${__dirname}/files/`, { recursive: true });
      }
      directory = directory.replace('//', '/');
      if (directory.includes('admin') && role != 'admin') {
        throw new UnauthorizedException();
      }
      await Promise.all(
        files.map(async (file) => {
          await promises.writeFile(
            `${__dirname}/files/${directory}/${file.originalname}`,
            file.buffer,
          );
          const newFile = new File();
          newFile.name = file.originalname;
          newFile.patch = `${directory}`;
          newFile.isDirectory = false;
          newFile.mimetype = file.mimetype;
          await this.fileRepository.save(newFile);
        }),
      );
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async getFiles(directory: string, role: string) {
    if (directory.includes('admin') && role != 'admin') {
      throw new UnauthorizedException();
    }
    return this.fileRepository.find({
      where: { patch: directory.replace('//', '/') },
      select: ['id', 'isDirectory', 'name', 'patch', 'mimetype'],
    });
  }

  async addDirectory({ name, directory }: AddDirectoryDTO, role: string) {
    if (role != 'admin') {
      throw new UnauthorizedException();
    }
    directory = directory.replace('//', '/');
    if (!existsSync(`${__dirname}/files/${directory}/${name}`)) {
      mkdirSync(`${__dirname}/files/${directory}/${name}`, { recursive: true });
      const newDirectory = new File();
      newDirectory.name = name;
      newDirectory.isDirectory = true;
      newDirectory.patch = directory;
      newDirectory.mimetype = 'directories';
      await this.fileRepository.save(newDirectory);
      return { message: 'Created' };
    }
    return { message: 'Exist' };
  }

  async getFile(id: string) {
    const file = await this.fileRepository.findOne({
      where: { id: id },
      select: ['id', 'isDirectory', 'name', 'patch', 'mimetype'],
    });

    if (file == null) {
      throw new NotFoundException();
    }
    const patchName = join(__dirname, '/files/', file.patch, file.name);

    return {
      file: await promises.readFile(patchName),
      type: file.mimetype,
      name: file.name,
    };
  }

  async streamVideo(id: string, headers: any, res: any) {
    const file = await this.fileRepository.findOne({
      where: { id: id },
      select: ['id', 'isDirectory', 'name', 'patch', 'mimetype'],
    });
    if (file == null) {
      throw new NotFoundException();
    }

    const patchName = join(__dirname, '/files/', file.patch, file.name);
    const { size } = statSync(patchName);
    const videoRange = headers.range;
    // console.log(headers);
    // console.log(videoRange);
    const parts = videoRange?.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 16) : size - 1;

    const chunksize = end - start + 2;
    const readStreamfile = createReadStream(patchName, {
      start,
      end,
      highWaterMark: 60,
    });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': chunksize,
    };
    res.writeHead(HttpStatus.PARTIAL_CONTENT, head); //206
    readStreamfile.pipe(res);
  }
}
