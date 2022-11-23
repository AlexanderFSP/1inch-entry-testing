import { Component, OnInit } from '@angular/core';
import { ChainId } from '@core/models/chain-id.model';
import { IWethContract, WethContractService } from '@core/services/contracts/weth-contract.service';
import { EthersProviderService } from '@core/services/ethers-provider.service';
import { EthersSignerService } from '@core/services/ethers-signer.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private wethContractWithSigner?: IWethContract;

  public readonly GOERLI_CHAIN_ID = ChainId.GOERLI;

  constructor(
    public readonly ethersProviderService: EthersProviderService,
    public readonly ethersSignerService: EthersSignerService,
    private readonly wethContractService: WethContractService
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
      this.wethContractWithSigner = this.ethersSignerService.connectWithContract(this.wethContractService.create());

      // TODO: Impl. other stuff..
    });
  }
}
