import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-when-stable',
  template: `
    <div (click)="click()"></div>
    <p>{{ text }}</p>
  `
})
class WhenStableComponent implements OnInit {
  text: string = '1';

  ngOnInit(): void {
    this.click();
  }
  click() {
    setTimeout(() => {
      this.text += '1';
    }, 1000);
  }
}

fdescribe('WhenStableComponent', () => {
  let fixture, nativeElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WhenStableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WhenStableComponent);
    nativeElement = fixture.nativeElement;
  }));

  describe('fakeAsync', () => {
    it('should use whenStable for shallow component test', fakeAsync(() => {
      fixture.detectChanges(); // First invocation of click via OnInit

      expect(fixture.isStable()).toBe(false);
      tick(1000);
      fixture.whenStable().then(() => {
        expect(fixture.isStable()).toBe(true);
        fixture.detectChanges();
        expect(nativeElement.querySelector('p').textContent).toBe('11');
      });
    }));

    it('should use whenStable with browser click', fakeAsync(() => {
      fixture.detectChanges(); // First invocation of click via OnInit

      const button = nativeElement.querySelector('div');
      button.click(); // Second invocation
      expect(fixture.isStable()).toBe(false);

      tick(2000); // 1000ms timeout @ 2 invocations
      fixture.whenStable().then(() => {
        expect(fixture.isStable()).toBe(true);
        fixture.detectChanges(); // Update DOM
        expect(nativeElement.querySelector('p').textContent).toBe('111');
      });
    }));

    it('should not require when stable for fakeAsync for isolated test', fakeAsync(() => {
      fixture.componentInstance.click();
      expect(fixture.isStable()).toBe(true);
      tick(1000);
      expect(fixture.componentInstance.text).toBe('11');
    }));
  });

  describe('async', () => {
    it('should use whenStable for shallow component test', async(() => {
      fixture.detectChanges(); // First invocation of click via OnInit

      expect(fixture.isStable()).toBe(false);

      fixture.whenStable().then(() => {
        expect(fixture.isStable()).toBe(true);
        fixture.detectChanges(); // Update the DOM
        expect(nativeElement.querySelector('p').textContent).toBe('11');
      });
    }));

    it('should use whenStable with browser click', async(() => {
      fixture.detectChanges(); // First invocation of click via OnInit

      const button = nativeElement.querySelector('div');
      button.click(); // Second invocation of click via OnInit
      expect(fixture.isStable()).toBe(false);

      fixture.whenStable().then(() => {
        fixture.detectChanges(); // Update DOM
        expect(nativeElement.querySelector('p').textContent).toBe('111');
      });
    }));
  });

  describe('done', () => {
    it('should use whenStable in shallow test with fixture OnInit', done => {
      fixture.detectChanges(); // Trigger NgOnInit

      expect(fixture.isStable()).toBe(false);
      fixture.whenStable().then(() => {
        expect(fixture.isStable()).toBe(true);
        fixture.detectChanges(); // update DOM
        expect(fixture.nativeElement.querySelector('p').textContent).toBe('11');
        done();
      });
    });

    it('should use whenStable in shallow test with browser click', done => {
      expect(fixture.nativeElement.querySelector('p').textContent).toBe('');

      const button = fixture.nativeElement.querySelector('div');
      button.click();

      expect(fixture.isStable()).toBe(false);
      fixture.whenStable().then(() => {
        expect(fixture.isStable()).toBe(true);
        fixture.detectChanges();
        expect(fixture.componentInstance.text).toBe('11');
        expect(fixture.nativeElement.querySelector('p').textContent).toBe('11');
        done();
      });
    });
  });
});
