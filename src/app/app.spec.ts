import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('KoboTracker');
  });

  it('should toggle the mobile menu when the menu button is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const menuButton = compiled.querySelector('.menu-toggle') as HTMLButtonElement;
    const sidebar = compiled.querySelector('.sidebar') as HTMLElement;

    expect(menuButton).toBeTruthy();
    expect(sidebar.classList.contains('open')).toBeFalsy();

    menuButton.click();
    fixture.detectChanges();

    expect(sidebar.classList.contains('open')).toBeTruthy();
  });
});
