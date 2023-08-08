import { Test } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthGuard],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should allow request with valid token', () => {
    const context = createMock<ExecutionContext>();

    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        authorization: 'Bearer cool',
      },
    });

    expect(authGuard.canActivate(context)).toBeTruthy();
  });

  it('should throw UnauthorizedException with invalid token', () => {
    const context = createMock<ExecutionContext>();

    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        authorization: 'Bearer cold',
      },
    });

    expect(() =>
      authGuard.canActivate(context as ExecutionContext),
    ).toThrowError(UnauthorizedException);
  });

  it('should throw UnauthorizedException when token is missing', () => {
    const context = createMock<ExecutionContext>();

    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        authorization: '',
      },
    });

    expect(() =>
      authGuard.canActivate(context as ExecutionContext),
    ).toThrowError(UnauthorizedException);
  });
});
