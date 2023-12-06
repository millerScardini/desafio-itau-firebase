import { FireService } from './services/fire.service';
import { Component, OnInit } from '@angular/core';
import { Customer } from './models/customer.model';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';
// import { AngularFireDatabase, SnapshotAction } from '@angular/fire/compat/database';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ MessageService, ConfirmationService ]
})

export class AppComponent implements OnInit {

  productDialog: boolean = false;

    customerList: Customer[] = [];
    customer: Customer = {};

    selectedCustomers: Customer[] = [];

    list: Observable<Customer[]> = of([]);

    constructor(
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      public auth: AuthService,
      private fireService: FireService
    ) { 
      auth.SignIn('miller.scardini@gmail.com', '123456');
    }

    ngOnInit() {
        // this.auth.SignIn('miller.scardini@gmail.com', '123456');
        this.fireService.getAll().subscribe(response => {
            this.customerList = response;
            // console.log(this.customerList);
        });
    }

    openNew() {
        this.customer = {};
        // this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected customers?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.customerList = this.customerList.filter(val => !this.selectedCustomers.includes(val));
                this.fireService.deleteMultiple(this.selectedCustomers);
                this.selectedCustomers = [];
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
            }
        });
    }

    editProduct(customer: Customer) {
        this.customer = {...customer};
        this.productDialog = true;
    }

    deleteProduct(customer: Customer) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + customer.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.customerList = this.customerList.filter(val => val.id !== customer.id);
                this.fireService.delete(customer);
                this.customer = {};
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
    }

    saveProduct() {

        if (this.customer.name?.trim()) {
            if (this.customer.id) {
                this.customerList[this.findIndexById(this.customer.id)] = this.customer;
                this.fireService.update(this.customer);
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
            }
            else {
                this.customer.id = this.createId();
                // this.customer.image = 'product-placeholder.svg';
                this.customerList.push(this.customer);
                this.fireService.insert(this.customer);
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
            }

            this.customerList = [...this.customerList];
            this.productDialog = false;
            this.customer = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.customerList.length; i++) {
            if (this.customerList[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( var i = 0; i < 5; i++ ) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}
