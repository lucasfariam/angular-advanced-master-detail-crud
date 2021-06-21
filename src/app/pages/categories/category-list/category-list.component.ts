import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/caterory.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }
  
  ngOnInit(): void {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories, 
      error => alert('Erro ao carregar lista')
    )
  }

  deleteCategory(category: any) {
    const mustDelete = confirm("Deseja realmente deletar este item?")
    if (mustDelete) {
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category),
        () => alert("Erro ao tentar excluir!")
      )
    }
  }

}
