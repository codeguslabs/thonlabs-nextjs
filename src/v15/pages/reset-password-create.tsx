import { Metadata } from 'next';
import LandingGrid from './components/landing-grid';
import AuthHeader from './components/auth-header';
import { notFound } from 'next/navigation';
import CreateNewPasswordForm from './components/create-new-password-form';
import { labsPublicAPI } from '../../shared/utils/api';
import { cn } from '../../ui/core/utils';

export const metadata: Metadata = {
  title: 'Create a new password',
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  token: string;
  inviteFlowEmail?: string;
  isPreview?: boolean;
}

export default async function ResetPasswordCreate({
  token,
  inviteFlowEmail,
  isPreview = false,
}: Props) {
  // Validates the token
  try {
    await labsPublicAPI(`/auth/reset-password/${token}`);
  } catch (e) {
    notFound();
  }

  return (
    <div
      className={cn('flex items-center justify-center', {
        'h-[30rem]': isPreview,
        'h-screen': !isPreview,
      })}
    >
      <LandingGrid />
      <div className="sm:pt-0 px-3 w-full sm:max-w-[400px] relative md:-mt-16">
        <AuthHeader
          title="Create a New Password"
          description="Please complete the form below to create a new password for your account."
          className="mb-10"
        />
        <CreateNewPasswordForm token={token} email={inviteFlowEmail} />
      </div>
    </div>
  );
}
