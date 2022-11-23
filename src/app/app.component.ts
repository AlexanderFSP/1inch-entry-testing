import { Component, OnInit } from '@angular/core';
import { EthersProviderService } from '@core/services/ethers-provider.service';
import { EthersSignerService } from '@core/services/ethers-signer.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    public readonly ethersProviderService: EthersProviderService,
    public readonly ethersSignerService: EthersSignerService
  ) {}

  public ngOnInit(): void {
    this.ethersProviderService.init();

    this.setup();
  }

  public onConnect(): void {
    this.ethersProviderService.requestAccounts();
  }

  private setup(): void {
    this.ethersSignerService.currentAccount$.pipe(filter(currentAccount => !!currentAccount)).subscribe(() => {
      // TODO: Setup WETH contract..
    });
  }
}
