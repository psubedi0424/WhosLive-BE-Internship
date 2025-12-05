import { Injectable } from '@nestjs/common';
import * as opossum from 'opossum';
import axios from 'axios';

@Injectable()
export class ProviderService {
  private breaker: any;

  constructor() {
    const fetchFn = async () => {
      // simulate calling twitch/youtube API
      const res = await axios.get('http://localhost:3000/streams');
      return res.data;
    };

    this.breaker = new opossum(fetchFn, {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 15000,
    });
  }

  async getLiveData() {
    try {
      return await this.breaker.fire();
    } catch (e) {
      return { error: 'circuit_open', message: e.message };
    }
  }
}
