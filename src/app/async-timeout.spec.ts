import { async, fakeAsync, tick } from '@angular/core/testing';

describe('Async tests using setTimeout', () => {
    it('should demonstrate Jasmine:done', ((done) => {
        const start = performance.now();

        setTimeout(() => {
            expect(1).toBe(1);
            const end = performance.now() - start;
            done();
        }, 3000);
    }));

    it('should demonstrate Angular:async', async(() => {
        const start = performance.now();

        setTimeout(() => {
            expect(1).toBe(1);
            const end = performance.now() - start; // expect 3000ms
        }, 3000);
    }));

    it('should demonstrate Angular: fakeAsync', fakeAsync(() => {
        const start = performance.now();

        setTimeout(() => {
            const end = performance.now() - start; // expect ~1ms
        }, 3000);

        tick(3000);
        expect(1).toBe(1);
    }));
});
