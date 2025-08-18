import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Сущность фильма для PostgreSQL (TypeORM)
 */
@Entity('films')
export class FilmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'float' })
  rating: number;

  @Column({ type: 'varchar' })
  director: string;

  @Column({ type: 'varchar', array: true })
  tags: string[];

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  about: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'varchar' })
  cover: string;
}
