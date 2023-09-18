import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(
    private firestore: AngularFirestore,
    private toastr: ToastrService
  ) {}

  saveData(data: any) {
    this.firestore
      .collection('categories')
      .add(data)
      .then((docRef) => {
        console.log(docRef);
        this.toastr.success('Data inserted successfully..!');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  loadData() {
    return this.firestore
      .collection('categories')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  updateData(id: any, editedData: any) {
    this.firestore
      .doc(`categories/${id}`)
      .update(editedData)
      .then((docRef) => {
        this.toastr.success('Data updated successfully..!');
      });
  }

  deleteData(id : string){
    this.firestore
        .doc(`categories/${id}`)
        .delete()
        .then((docRef) => {
          this.toastr.success('Data deleted successfully..!');
        });
  }
}
