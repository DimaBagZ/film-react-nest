import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { FilmEntity } from './film.entity';

/**
 * Сущность сеанса фильма (Schedule)
 * Хранит параметры показа и список занятых мест в формате `${row}:${seat}`
 */
@Entity('schedules')
export class ScheduleEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'timestamptz' })
  daytime: string;

  @Column({ type: 'int' })
  hall: number;

  @Column({ type: 'int' })
  rows: number;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'varchar', array: true, default: [] })
  taken: string[];

  @ManyToOne(() => FilmEntity, (f) => f.schedule, { onDelete: 'CASCADE' })
  film: FilmEntity;
}
