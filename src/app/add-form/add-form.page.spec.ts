import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { AddFormPageRoutingModule } from './add-form-routing.module';


import { AddFormPage } from './add-form.page';
import { AddFormPageModule } from './add-form.module';

describe('AddFormPage', () => {
  let component: AddFormPage;
  let fixture: ComponentFixture<AddFormPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFormPage ],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, RouterTestingModule, AddFormPageModule ],
      
    }).compileComponents();

    fixture = TestBed.createComponent(AddFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
