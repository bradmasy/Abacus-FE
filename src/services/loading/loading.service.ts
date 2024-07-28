import { Injectable, WritableSignal, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject =
    new BehaviorSubject<boolean>(false);

  public loading: WritableSignal<boolean> = signal(true);

  loadingOn() {
    this.loading.set(true);
  }

  loadingOff() {
    this.loading.set(false);

  }

  getLoading():boolean{
    return this.loadingSubject.value;
  }
}
