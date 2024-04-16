import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  Headers,
  Header,
  Param,
  Res,
} from '@nestjs/common';

import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AddDirectoryDTO } from './dto/AddDirectory.dto';

const MAX_FILE_SIZE = 100 * 1024 * 1024;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  public async uploadFile(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: MAX_FILE_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    files: Express.Multer.File[],
    @Body()
    body: { folderName: string },
    @Headers() headers: { role: string },
  ) {
    const { role } = headers;
    await this.appService.saveFiles(files, body.folderName, role);
    return 'Files Saved';
  }

  @Get('files')
  public async getFiles(
    @Query() params: { directory: string },
    @Headers() headers: { role: string },
  ) {
    const { role } = headers;

    const { directory } = params;
    return await this.appService.getFiles(directory, role);
  }

  @Get('file-download')
  public async getFile(@Query() params: { id: string }) {
    const { id } = params;
    return await this.appService.getFile(id);
  }

  @Post('files')
  public async addDirectory(
    @Body()
    body: AddDirectoryDTO,
    @Headers() headers: { role: string },
  ) {
    const { role } = headers;

    const { name, directory } = body;
    return await this.appService.addDirectory({ name, directory }, role);
  }

  @Get('stream/:id')
  @Header('Accept-Ranges', 'bytes') //custom header for byte range
  @Header('Content-Type', 'video/mp4')
  async streamVideo(
    @Param('id') id: string,
    @Headers() headers: { range: string },
    @Res() res: Response,
  ) {
    return this.appService.streamVideo(id, headers, res);
  }
}
