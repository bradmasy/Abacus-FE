import { Component, effect, HostBinding, Input, OnInit, signal, WritableSignal } from '@angular/core';

const SLIDE_OUT_WAIT = 3000;

@Component({
  selector: 'ab-delete-notification',
  templateUrl: './delete-notification.component.html',
  styleUrl: './delete-notification.component.scss'
})
export class DeleteNotificationComponent implements OnInit {

  @Input() display: WritableSignal<boolean> = signal(false);
  @Input() deleteData!: WritableSignal<{ [key: string]: string | number }>;

  public taskId: string = '';
  public slideIn: WritableSignal<Boolean> = signal(false);
  public slideOut: WritableSignal<Boolean> = signal(false);
  public dataString = "";

  @HostBinding('class.visible') get isVisible() {
    return this.display();
  }


  constructor() {

    effect(() => {

      if (this.display()) {
        setTimeout(() => {
          this.startSlideIn();
          setTimeout(() => {
            this.startSlideOut()
          }, SLIDE_OUT_WAIT);
        }, SLIDE_OUT_WAIT)

      }
    }, { allowSignalWrites: true })
  }
  
  ngOnInit(): void {
    this.dataString = `Task: ${this.deleteData()['id']} has been deleted.`
  }

  startSlideIn() {
    this.slideIn.set(true);
    this.slideOut.set(false);
  }

  startSlideOut() {
    this.slideIn.set(false);
    this.slideOut.set(true);
  }
}
