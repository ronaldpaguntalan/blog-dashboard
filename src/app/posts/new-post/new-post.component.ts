import { Component } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent {
  permalink: string = '';
  imgSrc: any = './assets/image-placeholder.jpg';
  selectedImg: any = '';
  categories: Category[] = [];

  constructor( private categoryService : CategoriesService ){}

  ngOnInit(): void{
    this.categoryService.loadData().subscribe((val: any) => {
      this.categories = val as Category[];
    });
  }

  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result
    }

    if($event.target.files && $event.target.files[0]) {
      reader.readAsDataURL($event.target.files[0]);
      this.selectedImg = $event.target.files[0];
    }
  }
}
