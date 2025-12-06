import { Injectable } from '@nestjs/common';
// import * as opossum from 'opossum';
import axios from 'axios';
import Circuitbreaker from 'opossum';

@Injectable()
export class ProviderService {
  private breaker: any;

  constructor() {
    const fetchFn = async () => {
      // simulate calling twitch/youtube API
      const res = await axios.get('http://localhost:3000/streams');
      return res.data;
    };

    this.breaker = new Circuitbreaker(fetchFn, {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 5000,
    });
    this.breaker.on('open', () => {
      console.log(' Circuit OPEN');
    });

    this.breaker.on('halfOpen', () => {
      console.log(' Circuit HALF-OPEN');
    });

    this.breaker.on('close', () => {
      console.log(' Circuit CLOSED');
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
