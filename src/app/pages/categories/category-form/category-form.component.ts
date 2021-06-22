import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/caterory.model';

@Component({
   selector: 'app-category-form',
   templateUrl: './category-form.component.html',
   styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

   currentAction: string;
   categoryForm: FormGroup;
   pageTitle: string;
   serverErrorMessages: string[] = null;
   submittingForm: boolean = false;
   category: Category = new Category();

   constructor(
      private categoryService: CategoryService,
      private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder
   ) { }

   ngOnInit(): void {
      this.setCurrentAction()
      this.buildCategoryForm()
      this.loadCategory()
   }

   ngAfterContentChecked() {

   }

   private setCurrentAction() {
      this.route.snapshot.url
   }
   private buildCategoryForm() {
     
   }
   private loadCategory() {
      
   }

}
