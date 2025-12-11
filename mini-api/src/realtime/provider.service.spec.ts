import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import Circuitbreaker from 'opossum';
import { ProviderService } from './provider.service';

// -----------------------------
// MOCK AXIOS
// -----------------------------
jest.mock('axios');

// -----------------------------
// MOCK OPOSSUM (Circuitbreaker)
// -----------------------------
const mockFire = jest.fn();
const mockOn = jest.fn();

jest.mock('opossum', () => {
  return jest.fn().mockImplementation((fn, options) => {
    return {
      fire: mockFire,
      on: mockOn,
      options,
    };
  });
});

describe('ProviderService', () => {
  let service: ProviderService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderService],
    }).compile();

    service = module.get<ProviderService>(ProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------------------------------
  // BREAKER OPTIONS TEST
  // ---------------------------------------
  it('should configure circuit breaker with correct options', () => {
    expect(Circuitbreaker).toHaveBeenCalledTimes(1);

    const args = (Circuitbreaker as jest.Mock).mock.calls[0][1];

    expect(args).toEqual({
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 5000,
    });
  });

  // ---------------------------------------
  // EVENT HANDLER REGISTRATION
  // ---------------------------------------
  it('should register event listeners for circuit events', () => {
    expect(mockOn).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('halfOpen', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('close', expect.any(Function));
  });

  // ---------------------------------------
  // SUCCESS CASE
  // ---------------------------------------
  it('should return live data on success', async () => {
    mockFire.mockResolvedValue({ ok: true, live: [] });

    const res = await service.getLiveData();

    expect(res).toEqual({ ok: true, live: [] });
    expect(mockFire).toHaveBeenCalledTimes(1);
  });

  // ---------------------------------------
  // FAILURE CASE
  // ---------------------------------------
  it('should return circuit_open when fire() throws error', async () => {
    mockFire.mockRejectedValue(new Error('Breaker error'));

    const res = await service.getLiveData();

    expect(res).toEqual({
      error: 'circuit_open',
      message: 'Breaker error',
    });
  });
});
