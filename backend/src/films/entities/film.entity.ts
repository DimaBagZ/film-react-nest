import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

/**
 * Сущность фильма для PostgreSQL (TypeORM)
 * Связь: один фильм → много сеансов (ScheduleEntity)
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

  @OneToMany(() => ScheduleEntity, (s) => s.film, { cascade: true })
  schedule: ScheduleEntity[];
}
