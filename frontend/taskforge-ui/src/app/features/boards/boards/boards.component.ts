import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  BoardService
} from '../../../core/services/board.service';

import {
  MatCardModule
} from '@angular/material/card';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

@Component({
  selector: 'app-boards',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],

  templateUrl: './boards.component.html',

  styleUrls: ['./boards.component.css']
})

export class BoardsComponent
implements OnInit {

  boards: any[] = [];

  boardForm: FormGroup;

  editingBoardId:
  number | null = null;

  constructor(
    private boardService: BoardService,
    private fb: FormBuilder
  ) {

    this.boardForm = this.fb.group({

      title: [''],

      description: ['']
    });
  }

  ngOnInit(): void {

    this.loadBoards();
  }

  loadBoards() {

    this.boardService
      .getBoards()
      .subscribe({

        next: (response) => {

          this.boards = response;
        },

        error: (error) => {

          console.log(error);
        }
      });
  }

  submitBoard() {

    if (
      this.editingBoardId !== null
    ) {

      this.updateBoard();

      return;
    }

    this.boardService
      .createBoard(
        this.boardForm.value
      )
      .subscribe({

        next: (response) => {

          this.boards = [
            ...this.boards,
            response
          ];

          this.boardForm.reset({

            title: '',
            description: ''
          });
        },

        error: (error) => {

          console.log(error);
        }
      });
  }

  editBoard(board: any) {

    this.editingBoardId =
      board.id;

    this.boardForm.patchValue({

      title: board.title,

      description:
        board.description
    });

    window.scrollTo({

      top: 0,

      behavior: 'smooth'
    });
  }

  updateBoard() {

    if (
      this.editingBoardId === null
    ) {
      return;
    }

    this.boardService
      .updateBoard(
        this.editingBoardId,
        this.boardForm.value
      )
      .subscribe({

        next: (updatedBoard) => {

          this.boards =
            this.boards.map(

              (board) => {

                if (
                  board.id ===
                  this.editingBoardId
                ) {

                  return updatedBoard;
                }

                return board;
              }
            );

          this.boardForm.reset({

            title: '',
            description: ''
          });

          this.editingBoardId = null;
        },

        error: (error) => {

          console.log(error);
        }
      });
  }

  deleteBoard(boardId: number) {

    const confirmed = confirm(
      'Delete this board?'
    );

    if (!confirmed) {
      return;
    }

    this.boardService
      .deleteBoard(boardId)
      .subscribe({

        next: () => {

          this.boards =
            this.boards.filter(

              board =>
                board.id !== boardId
            );
        },

        error: (error) => {

          console.log(error);
        }
      });
  }
}