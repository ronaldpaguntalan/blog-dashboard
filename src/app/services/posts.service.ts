import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  // Upload an image and save or update post data based on the formStatus
  uploadImage(selectedImage: any, postData: any, formStatus: string, id: any) {
    const filePath = `postIMG/${Date.now()}`;

    console.log(filePath);

    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('Image Uploaded Successfully');

      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((URL) => {
          postData.postImgPath = URL;

          if (formStatus === 'Edit') {
            // If the form is in 'Edit' mode, update the existing post data with the new data
            this.updateData(id, postData);
          } else {
            // If the form is in 'Add New' mode, save the new post data
            this.saveData(postData);
          }
        });
    });
  }

  // Save post data to Firestore
  saveData(postData: any) {
    this.firestore
      .collection('posts')
      .add(postData)
      .then((docRef) => {
        this.toastr.success('Data inserted successfully...!');
        this.router.navigate(['/posts']); // Redirect to posts page after successful insertion
      });
  }

  // Load all posts from Firestore, ordered by createdAt in descending order
  loadData() {
    return this.firestore
      .collection('posts', (ref) => ref.orderBy('createdAt', 'desc'))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Post; // Cast data to Post type
            const id = a.payload.doc.id;
            data.id = id; // Include id in data object
            return data;
          });
        })
      );
  }

  // Load a single post's data by its ID
  loadOneData(id: any) {
    return this.firestore.doc(`posts/${id}`).valueChanges();
  }

  // Update a document in the Firestore database with new data
  updateData(id: any, postData: any) {
    this.firestore
      .doc(`posts/${id}`) // Reference to the document to update (based on the provided 'id')
      .update(postData) // Update the document with the new data in 'postData'
      .then(() => {
        // If the update is successful, display a success message and navigate to the '/posts' route
        this.toastr.success('Data Updated Successfully'); // Show a success toast message
        this.router.navigate(['/posts']); // Navigate to the '/posts' route
      });
  }

  // Delete a post and its associated image
  deleteImage(postImgPath: any, id: any) {
    // Use the Firebase Storage reference to delete the image based on its URL
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => {
        // After the image is successfully deleted, call the deleteData method to delete the post from Firestore
        this.deleteData(id);
      });
  }

  // Delete post data from Firestore
  deleteData(id: any) {
    // Reference the Firestore document for the post using its ID and delete it
    this.firestore
      .doc(`posts/${id}`)
      .delete()
      .then(() => {
        // Display a warning toast message to indicate that the post has been deleted
        this.toastr.warning('Post deleted..!');
      });
  }

  markFeatured(id: any, featuredData: any){
    this.firestore.doc(`posts/${id}`).update(featuredData).then(() => {
      this.toastr.info('Featured status updated..!')
    })
  }
}
