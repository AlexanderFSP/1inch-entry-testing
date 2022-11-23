import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Address, Nullable } from '@core/models';

@Component({
  standalone: true,
  selector: 'app-metamask-account',
  templateUrl: './metamask-account.component.html',
  styleUrls: ['./metamask-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule]
})
export class MetamaskAccountComponent {
  @Input() public isMetamaskInstalled!: Nullable<boolean>;
  @Input() public currentAccount!: Nullable<Address>;

  @Output() public readonly connect = new EventEmitter<void>();

  public onClick(): void {
    if (!this.currentAccount) {
      this.connect.emit();
    }
  }
}
