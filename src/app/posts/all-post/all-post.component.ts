import { Component } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css'],
})
export class AllPostComponent {
  postArray: Post[] = []; // Array to store the list of posts

  constructor(private postsService: PostsService) {}

  // Initialize the component
  ngOnInit(): void {
    // Load post data from the service and populate the postArray
    this.postsService.loadData().subscribe((val: any) => {
      console.log(val);
      this.postArray = val;
    });
  }

  // Handle post deletion
  onDelete(postImgPath: any, id: any) {
    // Call the deleteImage method from the service to delete the post and its associated image
    this.postsService.deleteImage(postImgPath, id);
  }

 // Mark a post as featured or unfeatured
onFeatured(id: any, value: boolean) {
  // Create an object with the updated featured status
  const featuredData = {
    isFeatured: value
  };

  // Call the 'markFeatured' method from the 'postsService' to update the post's featured status
  this.postsService.markFeatured(id, featuredData);
}
}
