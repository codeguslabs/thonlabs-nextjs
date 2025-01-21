'use client';

import { Button } from '../../../ui/components/button';
import { Input, InputWrapper } from '../../../ui/components/input';
import { useForm } from 'react-hook-form';
import {
  ResetPasswordFormSchema,
  ResetPasswordFormData,
} from '../validators/auth-validators';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useToast } from '../../../ui/hooks/use-toast';
import Log from '../../../shared/utils/log';
import { resetPassword } from '../actions/auth-actions';

export default function ResetPasswordForm() {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      setLoading(true);

      await resetPassword(data);

      toast({
        title: 'Email sent',
        description:
          'Check the link in your email inbox to proceed with resetting your password.',
      });

      form.reset();
    } catch (e: any) {
      toast({
        title: 'Error sending email',
        description: 'An error ocurred when starting the reset password flow.',
        variant: 'destructive',
      });
      Log.error({
        action: 'resetPassword',
        message: e.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
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
      </div>

      <Button className="w-full mt-4" loading={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  );
}
