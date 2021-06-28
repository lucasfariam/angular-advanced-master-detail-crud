import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';

import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';
import { Category } from '../../categories/shared/caterory.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
   selector: 'app-entry-form',
   templateUrl: './entry-form.component.html',
   styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

   currentAction: string;
   entryForm: FormGroup;
   pageTitle: string;
   serverErrorMessages: string[] = null;
   submittingForm: boolean = false;
   entry: Entry = new Entry();
   categories: Array<Category>;

   imaskConfig = {
      mask: Number,
      scale: 2,
      thousandsSeparator: '',
      padFractionalZeros: true,
      normalizeZeros: true,
      radix: ','
   };

   constructor(
      private entryService: EntryService,
      private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
      private categoryService: CategoryService
   ) { }

   ngOnInit(): void {
      this.setCurrentAction()
      this.buildEntryForm()
      this.loadEntry()
      this.loadCategories()
   }

   ngAfterContentChecked() {
      this.setPageTitle();
   }

   submitForm() {
      this.submittingForm = true;
      if (this.currentAction == 'new') {
         this.createEntry();
      } else {
         this.updateEntry()
      }
   }

   // get typeOptions(): Array<any>{
   //    return Object.entries(Entry.types).map(
   //      ([value, text]) => {
   //        return {
   //          text: text,
   //          value: value
   //        }
   //      }
   //    )
   //  }

   private loadCategories() {
      this.categoryService.getAll().subscribe(
         categories => this.categories = categories
      );
   }

   private setCurrentAction() {
      if (this.route.snapshot.url[0].path == 'new') {
         this.currentAction = 'new'
      }
      else {
         this.currentAction = 'edit'
      }
   }
   private buildEntryForm() {
      this.entryForm = this.formBuilder.group({
         id: [null],
         name: [null, Validators.required],
         description: [null],
         type: [null, Validators.required],
         amount: [null, Validators.required],
         date: [null, Validators.required],
         paid: [true, Validators.required],
         categoryId: [null, Validators.required],
      });
   }
   private loadEntry() {
      if (this.currentAction == 'edit') {
         this.route.paramMap.pipe(
            switchMap(params => this.entryService.getById(+params.get('id')))
         )
            .subscribe(
               (entry) => {
                  this.entry = entry;
                  this.entryForm.patchValue(entry)
               },
               (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
            )
      }
   }

   private setPageTitle() {
      if (this.currentAction == 'new') {
         this.pageTitle = 'Cadastro de novo lançamento'
      } else {
         const entryName = this.entry.name || '';
         this.pageTitle = 'Editanto Lançamento: ' + entryName;
      }
   }

   private createEntry() {
      const entry: Entry = Entry.fromJson(this.entryForm.value);
      this.entryService.create(entry).subscribe(
         entry => this.actionsForSuccess(entry),
         error => this.actionsForError(error)
      )
   }
   private updateEntry() {
      const entry: Entry = Entry.fromJson(this.entryForm.value);
      this.entryService.update(entry).subscribe(
         entry => this.actionsForSuccess(entry),
         error => this.actionsForError(error)
      )
   }
   private actionsForSuccess(entry: Entry) {
      this.toastr.success('Solicitação processada com sucesso!');
      this.router.navigateByUrl('entries', { skipLocationChange: true }).then(
         () => this.router.navigate(['entries', entry.id, 'edit'])
      );

   }
   private actionsForError(error) {
      this.toastr.error('Solicitação não processada, ocorreu um erro!')
      this.submittingForm = false;
      if (error.status === 422) {
         this.serverErrorMessages = JSON.parse(error._body).errors;
      } else {
         this.serverErrorMessages = ['Falha na comunicação com servidor, contate o SUPORTE'];
      }
   }
}
