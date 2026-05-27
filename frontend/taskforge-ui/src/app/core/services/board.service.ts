import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiUrl =
    'http://127.0.0.1:8000/boards/';

  constructor(
    private http: HttpClient
  ) {}

  getBoards(): Observable<any> {

    return this.http.get(
      this.apiUrl
    );
  }

  createBoard(
    boardData: any
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      boardData
    );
  }

  updateBoard(
    boardId: number,
    boardData: any
  ): Observable<any> {
  
    return this.http.put(
      `${this.apiUrl}${boardId}`,
      boardData
    );
  }
  
  deleteBoard(
    boardId: number
  ): Observable<any> {
  
    return this.http.delete(
      `${this.apiUrl}${boardId}`
    );
  }
}
