import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { FilmEntity } from './film.entity';

/**
 * Сущность сеанса фильма (Schedule)
 * Хранит параметры показа и список занятых мест в формате `${row}:${seat}`
 */
@Entity('schedules')
export class ScheduleEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'timestamp' })
  daytime: string;

  @Column({ type: 'int' })
  hall: number;

  @Column({ type: 'int' })
  rows: number;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', default: '[]' })
  taken: string;

  @Column({ name: 'filmId', type: 'uuid' })
  filmId: string;

  @ManyToOne(() => FilmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filmId' })
  film: FilmEntity;
}
