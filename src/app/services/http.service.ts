import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { APIResponse, Game } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private APIKey = '5ea08006ea754db7a510e5802cdfc9cc';
  constructor(private http: HttpClient) { }

  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('key', this.APIKey).set('ordering', ordering);
    if (search) {
      params = new HttpParams().set('key', this.APIKey).set('ordering', ordering).set('search', search);
    }
    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, { 
      params : params 
    });
  }

  getGameDetails(id: string): Observable<Game> {
    let url = `${env.BASE_URL}/games/${id}`;
    const gameInfoRequest = this.http.get(url, {params:{key: this.APIKey}});
    const gameTrailersRequest = this.http.get(url + `/movies`, {params:{key: this.APIKey}});
    const gameScreenshotsRequest = this.http.get(url + `/screenshots`, {params:{key: this.APIKey}});

    return forkJoin({gameInfoRequest, gameTrailersRequest, gameScreenshotsRequest}).pipe(
      map((resp: any) => {
        return{
          ...resp['gameInfoRequest'],
          screenshots: resp['gameScreenshotsRequest']?.results,
          trailers: resp['gameTrailersRequest']?.results
        }
      })
    );
  }
}