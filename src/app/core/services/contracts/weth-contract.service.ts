import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { EthersContractService } from '../ethers-contract.service';

export interface IWethContract extends ethers.Contract {
  approve: ethers.ContractFunction;
}

@Injectable({
  providedIn: 'root'
})
export class WethContractService {
  constructor(private readonly ethersContractService: EthersContractService) {}

  public create(signerOrProvider?: ethers.Signer | ethers.providers.Provider): IWethContract {
    return this.ethersContractService.createContract(
      '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      [
        {
          constant: false,
          inputs: [
            { name: 'guy', type: 'address' },
            { name: 'wad', type: 'uint256' }
          ],
          name: 'approve',
          outputs: [{ name: '', type: 'bool' }],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      signerOrProvider
    ) as IWethContract;
  }
}
