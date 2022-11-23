import { Inject, Injectable } from '@angular/core';
import { Nullable } from '@core/models';
import detectEthereumProvider from '@metamask/detect-provider';
import { WINDOW } from '@ng-web-apis/common';
import { ethers } from 'ethers';
import { BehaviorSubject, Observable } from 'rxjs';

import { EthersSignerService } from './ethers-signer.service';

interface IMetamaskWindow extends Window {
  ethereum?: {
    isMetaMask?: boolean;
    on(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
    on(event: 'chainChanged', handler: (chainId: number) => void): void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EthersProviderService {
  public isMetamaskInstalled$: Observable<boolean>;
  public networkId$: Observable<Nullable<number>>;

  /**
   * A Provider (in ethers) is a class which provides an abstraction for a connection to the
   * Ethereum Network. It provides read-only access to the Blockchain and its status
   */
  private provider?: ethers.providers.Web3Provider;

  private readonly _networkId$ = new BehaviorSubject<Nullable<number>>(null);
  private readonly _isMetamaskInstalled$ = new BehaviorSubject(false);

  constructor(
    @Inject(WINDOW) private readonly window: IMetamaskWindow,
    private readonly ethersSignerService: EthersSignerService
  ) {
    this.networkId$ = this._networkId$.asObservable();
    this.isMetamaskInstalled$ = this._isMetamaskInstalled$.asObservable();
  }

  public async init(): Promise<void> {
    // Resolve ethereum provider (EIP-1193)
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });

    if (provider) {
      this.provider = new ethers.providers.Web3Provider(provider);

      const chainId = (await this.provider.getNetwork()).chainId;

      this._networkId$.next(chainId);
      this._isMetamaskInstalled$.next(true);

      this.setupSigner();
      this.listenNetworkChanges();
    }
  }

  /**
   * a.k.a. login
   */
  public requestAccounts(): Promise<string[]> {
    return this.provider!.send('eth_requestAccounts', []) as Promise<string[]>;
  }

  private setupSigner(): void {
    this.ethersSignerService.setSigner(this.provider!.getSigner());

    this.window.ethereum!.on('accountsChanged', () => this.ethersSignerService.setSigner(this.provider!.getSigner()));
  }

  private listenNetworkChanges(): void {
    this.window.ethereum!.on('chainChanged', () => this.window.location.reload());
  }
}
