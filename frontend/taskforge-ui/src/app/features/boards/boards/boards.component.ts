import {
  Component,
  ChangeDetectorRef,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators
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

import {
  MatIconModule
} from '@angular/material/icon';

import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-boards',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],

  templateUrl: './boards.component.html',

  styleUrls: ['./boards.component.css']
})

export class BoardsComponent
implements OnInit {

  @ViewChild(FormGroupDirective)
  private formDirective?: FormGroupDirective;

  boards: any[] = [];

  boardForm: FormGroup;

  editingBoardId:
  number | null = null;

  loading = false;

  loadingBoards = false;

  errorMessage = '';

  deletingBoardIds = new Set<number>();

  constructor(
    private boardService: BoardService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.boardForm = this.fb.group({

      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(80),
          Validators.pattern(/\S/)
        ]
      ],

      description: [
        '',
        [
          Validators.maxLength(300)
        ]
      ]
    });
  }

  ngOnInit(): void {

    this.loadBoards();
  }

  loadBoards() {

    this.errorMessage = '';

    this.loadingBoards = true;

    this.boardService
      .getBoards()
      .subscribe({

        next: (response) => {

          this.boards = response;

          this.loadingBoards = false;

          this.syncView();
        },

        error: (error) => {

          console.log(error);

          this.errorMessage =
            'Unable to load boards. Please try again.';

          this.loadingBoards = false;

          this.syncView();
        }
      });
  }

  submitBoard() {

    this.errorMessage = '';

    this.boardForm.markAllAsTouched();

    if (this.boardForm.invalid) {
      return;
    }

    if (
      this.editingBoardId !== null
    ) {

      this.updateBoard();

      return;
    }

    this.loading = true;

    this.boardService
      .createBoard(
        this.getBoardPayload()
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

          this.resetBoardFormState();

          this.loading = false;

          this.syncView();
        },

        error: (error) => {

          console.log(error);

          this.errorMessage =
            'Unable to create board. Please check the details and try again.';

          this.loading = false;

          this.syncView();
        }
      });
  }

  editBoard(
    board: any,
    event?: MouseEvent
  ) {

    event?.stopPropagation();

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

    this.boardForm.markAllAsTouched();

    if (this.boardForm.invalid) {
      return;
    }

    this.loading = true;

    this.boardService
      .updateBoard(
        this.editingBoardId,
        this.getBoardPayload()
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

          this.resetBoardFormState();

          this.editingBoardId = null;

          this.loading = false;

          this.syncView();
        },

        error: (error) => {

          console.log(error);

          this.errorMessage =
            'Unable to update board. Please check the details and try again.';

          this.loading = false;

          this.syncView();
        }
      });
  }

  cancelEdit() {

    this.editingBoardId = null;

    this.errorMessage = '';

    this.boardForm.reset({

      title: '',
      description: ''
    });

    this.resetBoardFormState();
  }

  goToDashboard() {

    this.router.navigate(
      ['/dashboard']
    );
  }

  deleteBoard(
    board: any,
    event?: MouseEvent
  ) {

    event?.preventDefault();

    event?.stopPropagation();

    if (this.loading) {
      return;
    }

    if (
      this.deletingBoardIds.has(board.id)
    ) {
      return;
    }

    const confirmed = confirm(
      'Delete this board?'
    );

    if (!confirmed) {
      return;
    }

    const previousBoards = [
      ...this.boards
    ];

    this.errorMessage = '';

    this.deletingBoardIds.add(
      board.id
    );

    this.boards =
      this.boards.filter(

        existingBoard =>
          existingBoard.id !== board.id
      );

    this.syncView();

    this.boardService
      .deleteBoard(board.id)
      .subscribe({

        next: () => {

          this.deletingBoardIds.delete(
            board.id
          );

          this.syncView();
        },

        error: (error) => {

          console.log(error);

          this.boards = previousBoards;

          this.deletingBoardIds.delete(
            board.id
          );

          this.errorMessage =
            'Unable to delete board. Please try again.';

          this.syncView();
        }
      });
  }

  private getBoardPayload() {

    const title =
      this.boardForm.value.title?.trim();

    const description =
      this.boardForm.value.description?.trim();

    return {
      title,
      description: description || null
    };
  }

  private resetBoardFormState() {

    this.formDirective?.resetForm({

      title: '',
      description: ''
    });

    if (!this.formDirective) {

      this.boardForm.reset({

        title: '',
        description: ''
      });

      this.boardForm.markAsPristine();

      this.boardForm.markAsUntouched();

      this.boardForm.updateValueAndValidity();
    }
  }

  private syncView() {

    this.cdr.detectChanges();
  }
}
