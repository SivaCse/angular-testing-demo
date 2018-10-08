import { TestBed, async, flush, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync } from '@angular/core/testing';

@Component({
    selector: 'app-user-signup',
    template: `<h1>{{userSignupCount}}</h1>`,
    styles: []
})
export class UserSignupComponent {
    public userSignupCount = 0;
    public isMaxUsers = false;

    public addNewUser(): Promise<any> {
        return new Promise(resolve => {
            resolve(1);
        }).then((res: number) => {

            if (this.userSignupCount < 5) {
                this.userSignupCount += res;
            } else {
                this.isMaxUsers = true;
            }

        });
    }

}

describe('UserSignupComponent', () => {

    let fixture: ComponentFixture<UserSignupComponent>;
    let component: UserSignupComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                UserSignupComponent
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserSignupComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should demonstrate isolated testing behavior for async with promises', async(() => {
        component.addNewUser().then(() => {
            expect(component.userSignupCount).toBe(3);
        });

        component.addNewUser();

        component.addNewUser();
    }));

    it('should demonstrate isolated testing behavior for fakeAsync with promises', fakeAsync(() => {
        // Simulate a few user signups
        component.addNewUser();
        component.addNewUser();
        component.addNewUser();
        component.addNewUser();
        component.addNewUser();
        expect(component.userSignupCount).toBe(0);
        flush();

        expect(component.userSignupCount).toBe(5);
        expect(component.isMaxUsers).toBe(false);

        component.addNewUser();
        flush();
        expect(component.userSignupCount).toBe(5);
        expect(component.isMaxUsers).toBe(true);
    }));

    it('should demonstrate shallow testing behavior with a failing test for fakeAsync with promises', fakeAsync(() => {
        component.addNewUser();

        // Trigger resolution for the promise
        flush();

        // Component should have correct value
        expect(component.userSignupCount).toBe(1);

        const htmlPreBinding = fixture.nativeElement.querySelector('h1');

        expect(htmlPreBinding.textContent).toBe('0');

        const htmlPostBonding = fixture.nativeElement.querySelector('h1');

        expect(htmlPostBonding.textContent).toBe('1');
    }));

    it('should demonstrate shallow testing behavior for fakeAsync with promises', fakeAsync(() => {
        component.addNewUser();

        // Trigger resolution for the promise
        flush();

        // Component should have correct value
        expect(component.userSignupCount).toBe(1);

        const htmlPreBinding = fixture.nativeElement.querySelector('h1');

        expect(htmlPreBinding.textContent).toBe('0', 'data bindings not updated to to manual change detection');

        fixture.detectChanges();

        const htmlPostBonding = fixture.nativeElement.querySelector('h1');

        expect(htmlPostBonding.textContent).toBe('1', 'data bindings now up to date after manual change detection');
    }));

});
