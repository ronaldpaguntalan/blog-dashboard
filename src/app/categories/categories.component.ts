import { Component } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent {
  categoryArray: Category[] = [];
  formCategory: string = "";
  formActionStatus: string = "Add";
  categoryId: string = "";

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val: any) => {
      this.categoryArray = val;
    });
  }

  onSubmit(formData: any) {
    let categoryData: Category = {
      data: {
        category: formData.value.category,
      },
      id: '',
    };

    if( this.formActionStatus == 'Add'){
      this.categoryService.saveData(categoryData.data);
      formData.reset();
    }
    else if(this.formActionStatus == 'Edit'){
      this.categoryService.updateData(this.categoryId, categoryData.data)
      formData.reset();
      this.formActionStatus = "Add";
    }

  }

  onEdit(category: any, id: string){
   this.formCategory = category;
   this.formActionStatus = "Edit";
   this.categoryId = id;
  }

  onDelete(id: string){
    this.categoryService.deleteData(id);
  }
}
