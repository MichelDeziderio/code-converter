import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NuMonacoEditorModule } from '@ng-util/monaco-editor';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { finalize, Subject, takeUntil } from 'rxjs';
import { IaServices } from '../core/services/ia-services/ia-services';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    DropdownModule,
    NuMonacoEditorModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    InputTextModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {

  languages = [
    { value: 'Pascal', label: 'Pascal' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'TypeScript', label: 'TypeScript' },
    { value: 'Python', label: 'Python' },
    { value: 'TSX', label: 'TSX' },
    { value: 'JSX', label: 'JSX' },
    { value: 'Vue', label: 'Vue' },
    { value: 'Go', label: 'Go' },
    { value: 'C', label: 'C' },
    { value: 'C++', label: 'C++' },
    { value: 'Java', label: 'Java' },
    { value: 'C#', label: 'C#' },
    { value: 'Visual Basic .NET', label: 'Visual Basic .NET' },
    { value: 'SQL', label: 'SQL' },
    { value: 'Assembly Language', label: 'Assembly Language' },
    { value: 'PHP', label: 'PHP' },
    { value: 'Ruby', label: 'Ruby' },
    { value: 'Swift', label: 'Swift' },
    { value: 'SwiftUI', label: 'SwiftUI' },
    { value: 'Kotlin', label: 'Kotlin' },
    { value: 'R', label: 'R' },
    { value: 'Objective-C', label: 'Objective-C' },
    { value: 'Perl', label: 'Perl' },
    { value: 'SAS', label: 'SAS' },
    { value: 'Scala', label: 'Scala' },
    { value: 'Dart', label: 'Dart' },
    { value: 'Rust', label: 'Rust' },
    { value: 'Haskell', label: 'Haskell' },
    { value: 'Lua', label: 'Lua' },
    { value: 'Groovy', label: 'Groovy' },
    { value: 'Elixir', label: 'Elixir' },
    { value: 'Clojure', label: 'Clojure' },
    { value: 'Lisp', label: 'Lisp' },
    { value: 'Julia', label: 'Julia' },
    { value: 'Matlab', label: 'Matlab' },
    { value: 'Fortran', label: 'Fortran' },
    { value: 'COBOL', label: 'COBOL' },
    { value: 'Bash', label: 'Bash' },
    { value: 'Powershell', label: 'Powershell' },
    { value: 'PL/SQL', label: 'PL/SQL' },
    { value: 'CSS', label: 'CSS' },
    { value: 'Racket', label: 'Racket' },
    { value: 'HTML', label: 'HTML' },
    { value: 'NoSQL', label: 'NoSQL' },
    { value: 'Natural Language', label: 'Natural Language' },
    { value: 'CoffeeScript', label: 'CoffeeScript' },
  ];

  selectInputLanguage = { value: 'TypeScript', label: 'TypeScript' };

  selectOutputLanguage = { value: 'Ruby', label: 'Ruby' };

  input: string = '';
  output: string = '';
  editorOptionsInput = { theme: 'vs-dark', language: 'typescript' };
  editorOptionsOutput = { theme: 'vs-dark', language: 'ruby' };

  height = '500px';
  isShowCopy = false;
  private destroy$ = new Subject<void>();
  loading = false;

  apiKey = '';

  constructor(
    private iaService: IaServices,
    private messageService: MessageService
  ) { }

  handleInput(event: any) {
    const { value } = event;

    this.selectInputLanguage = value;

    this.editorOptionsInput = { theme: 'vs-dark', language: value.value };

  }

  handleOutput(event: any) {
    const { value } = event;

    this.selectOutputLanguage = value;

    this.editorOptionsOutput = { theme: 'vs-dark', language: value.value };

    this.output = '';
    this.isShowCopy = false;

  }

  sendCodeConverter() {

    this.loading = true;

    const body = {
      messages: [
        { role: "system", content: this.createMessage() }
      ],
      model: "gpt-4o",
    };

    this.iaService.codeConverter(body, this.apiKey).pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.loading = false)),
    )
      .subscribe({
        next: (response) => {

          if (response) {
            const { message } = response.choices[0];
            this.output = message.content;
            this.isShowCopy = true;
          }
        },
        error: (err) => {
          
          const { error } = err;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
          });
        },
      });
  }

  createMessage() {
    const message = `
      You are an expert programmer in all programming languages. Translate the "${this.selectInputLanguage.value}" code to "${this.selectOutputLanguage.value}" code. Do not include \`\`\`.
  
      Example translating from JavaScript to Python:
  
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
  
      Python code:
      for i in range(10):
        print(i)
      
      ${this.selectInputLanguage.value} code:
      ${this.input}

      ${this.selectOutputLanguage.value} code (no \`\`\`):
     `
    return message;
  }

  copyCode(text?: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text ?? this.output;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  copyCodeButton() {
    this.copyCode()
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Code copied'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}
