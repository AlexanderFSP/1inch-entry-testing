import { Injectable, NgZone } from '@angular/core';
import { Address, nullable, Nullable } from '@core/models';
import { ethers } from 'ethers';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EthersSignerService {
  public currentAccount$: Observable<Nullable<Address>>;

  /**
   * A Signer is a class which (usually) in some way directly or indirectly has access
   * to a private key, which can sign messages and transactions to authorize the network
   * to charge your account ether to perform operations
   */
  private signer?: ethers.Signer;

  private readonly _currentAccount$ = new BehaviorSubject<Nullable<Address>>(null);

  constructor(private readonly ngZone: NgZone) {
    this.currentAccount$ = this._currentAccount$.asObservable();
  }

  public setSigner(signer: ethers.Signer): void {
    this.signer = signer;

    this.updateCurrentAccount();
  }

  public connectWithContract<T extends ethers.Contract>(contract: T): T {
    return contract.connect(this.signer!) as T;
  }

  private async updateCurrentAccount(): Promise<void> {
    let address: string;

    try {
      address = await this.signer!.getAddress();
    } catch {
    } finally {
      this.ngZone.run(() => this._currentAccount$.next(nullable(address)));
    }
  }
}
