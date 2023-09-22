import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent {
  // Properties
  permalink: string = ''; // Used to store the generated permalink
  imgSrc: any = './assets/image-placeholder.jpg'; // Used to display the selected image preview
  selectedImg: any = ''; // Stores the selected image file
  categories: Category[] = []; // Stores the list of categories

  postForm!: FormGroup; // Angular reactive form

  post: any; // Holds post data for editing

  formStatus: string = 'Add New'; // Indicates whether the form is in 'Add New' or 'Edit' mode

  docId: any; // Holds the ID of the document being edited

  @ViewChild('fileInput') fileInput: ElementRef | any; // Reference to the file input element
  @ViewChild('label') label: ElementRef | any; // Reference to the label element

  // Constructor
  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route : ActivatedRoute
  ) {
    // Initialize form group with form controls
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: [{value: '', disabled: true}, Validators.required],
      excerpt: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      postimg: [''],
      content: ['', [Validators.required, Validators.minLength(50)]],
    });

    // Subscribe to route query parameters
    this.route.queryParams.subscribe(val => {
      // Load post data for editing if 'id' query parameter is present
      this.docId = val['id'];
      if(this.docId){
        this.postService.loadOneData(val['id']).subscribe(post =>
          {
            if (post) { // Check if post is defined
              this.post = post;
              // Patch the form with post data for editing
              this.postForm.patchValue({
                title: this.post.title,
                permalink: this.post.permalink,
                excerpt: this.post.excerpt,
                category: `${this.post.category.categoryId}-${this.post.category.category}`,
                content: this.post.content,
              });
      
              this.imgSrc = this.post.postImgPath;
              this.formStatus = 'Edit';
            } else {
              console.log('No post found with id:', val['id']);
  
              // Set validators for postimg field when adding a new post
              this.postForm.get('postimg')?.setValidators(Validators.required);
              this.postForm.get('postimg')?.updateValueAndValidity();
            }
          });
      }
    })
  }

  // Getter for form controls
  get fc() {
    return this.postForm.controls;
  }

  // Initialize component
  ngOnInit(): void {
    // Load categories from a service
    this.categoryService.loadData().subscribe((val: any) => {
      this.categories = val as Category[];
    });
  }

  // Handle title change event to generate permalink
  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
    this.postForm.get('permalink')?.setValue(this.permalink);
  }

  // Display image preview
  showPreview($event: any, label: HTMLLabelElement) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };

    if ($event.target.files && $event.target.files[0]) {
      reader.readAsDataURL($event.target.files[0]);
      this.selectedImg = $event.target.files[0];
      label.textContent = $event.target.files[0].name;
    }
  }

  // Handle form submission
  onSubmit() {
    console.log(this.postForm.value);
    let splittedCategory = this.postForm.value.category.split('-');

    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.getRawValue().permalink,
      excerpt: this.postForm.value.excerpt,
      category: {
        categoryId: splittedCategory[0],
        category: splittedCategory[1],
      },
      postImgPath: '',
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    };
    // Upload the selected image and post data
    this.postService.uploadImage(this.selectedImg, postData, this.formStatus, this.docId);
    this.postForm.reset();
    this.imgSrc = "./assets/image-placeholder.jpg"

    this.fileInput.nativeElement.value = "";
    this.label.nativeElement.textContent = "Post Image";
  }
}
