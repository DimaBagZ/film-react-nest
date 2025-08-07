import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/schemas/film.schema';
import { FilmDto, SessionDto } from '../films/dto/films.dto';
import { IFilmsRepository } from './films.repository.interface';

/**
 * MongoDB репозиторий для работы с фильмами
 */
@Injectable()
export class FilmsMongoRepository implements IFilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  /**
   * Получить все фильмы
   */
  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().exec();
    return films.map((film) => this.mapToFilmDto(film));
  }

  /**
   * Получить фильм по ID
   */
  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    return film ? this.mapToFilmDto(film) : null;
  }

  /**
   * Получить расписание фильма по ID
   */
  async getFilmSchedule(id: string): Promise<SessionDto[]> {
    const film = await this.filmModel.findOne({ id }).exec();
    if (!film) {
      return [];
    }
    return film.schedule.map((session) => this.mapToSessionDto(session));
  }

  /**
   * Обновить занятые места в сеансе
   */
  async updateSessionTakenSeats(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<boolean> {
    const result = await this.filmModel
      .updateOne(
        {
          id: filmId,
          'schedule.id': sessionId,
        },
        {
          $set: {
            'schedule.$.taken': takenSeats,
          },
        },
      )
      .exec();

    return result.modifiedCount > 0;
  }

  /**
   * Маппинг документа MongoDB в DTO
   */
  private mapToFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  /**
   * Маппинг сеанса в DTO
   */
  private mapToSessionDto(session: any): SessionDto {
    return {
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken || [],
    };
  }
}
