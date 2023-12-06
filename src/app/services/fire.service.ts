import { Customer } from '../models/customer.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class FireService {

    constructor(private dbStore: AngularFirestore) {}

    getAll(): Observable<Customer[]> {
        // return this.dbStore.collection('customers').valueChanges() as Observable<Customer[]>;
        return this.dbStore.collection('customers').valueChanges({idField: 'fireId'}) as Observable<Customer[]>;
    }

    insert(customer: Customer) {
        this.dbStore.collection('customers').add(customer);
    }

    delete(customer: Customer) {
        this.dbStore.collection('customers').doc(customer.fireId).delete();
    }

    update(customer: Customer) {
        this.dbStore.collection('customers').doc(customer.fireId).update(customer);
    }

    deleteMultiple(customerList: Customer[]) {
        // let fireId = '';
        // customerList.forEach(customer => {
        //     fireId += customer.fireId + ', '
        // })
        // fireId = fireId.substring(0, fireId.length - 2);
        
        // console.log(customerList);
        // console.log(fireId);
        // this.dbStore.collection('customers').ref.where('idField', 'in', fireId);

        
        customerList.forEach(customer => {
            this.delete(customer);
        })
    }

}