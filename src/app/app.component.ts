import { Component, OnInit } from '@angular/core';
import { ChainId } from '@core/models';
import { IWethContract, WethContractService } from '@core/services/contracts/weth-contract.service';
import { EthersProviderService } from '@core/services/ethers-provider.service';
import { EthersSignerService } from '@core/services/ethers-signer.service';
import { ethers } from 'ethers';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private wethContractWithSigner?: IWethContract;

  public readonly SPENDER_ADDRESS = '0x6CD8401984a8dD15382dcbB44d87DD249472FD8b';
  public readonly GOERLI_CHAIN_ID = ChainId.GOERLI;

  public txHash?: string;
  public txNonce?: number;
  public txBlockNonce?: string;

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

  public async onApprove(): Promise<void> {
    const tx = (await this.wethContractWithSigner!.approve(this.SPENDER_ADDRESS, 1)) as ethers.ContractTransaction;

    this.txHash = tx.hash;
    this.txNonce = tx.nonce;

    await tx.wait(1);

    this.txBlockNonce = (await this.ethersProviderService.getBlock('latest')).nonce;
  }

  private setup(): void {
    this.ethersSignerService.currentAccount$.pipe(filter(currentAccount => !!currentAccount)).subscribe(() => {
      this.wethContractWithSigner = this.ethersSignerService.connectWithContract(this.wethContractService.create());
    });
  }
}
