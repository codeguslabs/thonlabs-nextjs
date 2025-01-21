'use client';

import { Button } from '../../../ui/components/button';
import { Input, InputWrapper } from '../../../ui/components/input';
import { Label } from '../../../ui/components/label';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { LoginFormData, LoginFormSchema } from '../validators/auth-validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../actions/auth-actions';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../ui/hooks/use-toast';
import { Typo } from '../../../ui/components/typo';
import { useEnvironmentData } from '../../hooks/use-environment-data';
import { AuthProviders } from '../../../shared/interfaces/environment-data';

export default function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { authProvider, enableSignUp } = useEnvironmentData();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(
      LoginFormSchema(authProvider === AuthProviders.MagicLogin),
    ),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setLoading(true);

      const result = await login(data);

      if (!result || result?.statusCode) {
        toast({
          title: 'Log in error',
          description:
            result?.message || result?.error || 'Invalid credentials',
          variant: 'destructive',
        });
        setLoading(false);
      } else {
        router.replace(result.emailSent ? '/auth/magic' : '/');
      }
    } catch (e) {
      console.error('Error loginForm.onSubmit: ', e);
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid w-full items-center gap-5">
          <InputWrapper>
            <Input
              id="email"
              placeholder="you@example.com"
              size="lg"
              label="Email"
              error={form.formState.errors.email?.message}
              {...form.register('email')}
            />
          </InputWrapper>

          {authProvider === AuthProviders.EmailAndPassword && (
            <InputWrapper>
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  className={`text-gray-500 hover:text-gray-900 dark:hover:text-gray-50 
            transition-all duration-200 ease-in-out 
            text-sm font-medium leading-none underline-offset-4 hover:underline`}
                  href="/auth/reset-password"
                  tabIndex={-1}
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                size="lg"
                error={form.formState.errors.password?.message}
                {...form.register('password')}
              />
            </InputWrapper>
          )}
        </div>

        <Button className="w-full mt-8" loading={loading}>
          {loading ? 'Logging in...' : 'Continue'}
        </Button>
      </form>
      {enableSignUp && (
        <div className="flex justify-center mt-4">
          <Typo variant="sm" className="text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href="/auth/sign-up"
              className="text-foreground hover:underline"
            >
              Sign up
            </Link>
          </Typo>
        </div>
      )}
    </>
  );
}
