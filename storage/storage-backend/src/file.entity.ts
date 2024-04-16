import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mimetype: string;

  @Column()
  patch: string;

  @Column()
  isDirectory: boolean;
}
