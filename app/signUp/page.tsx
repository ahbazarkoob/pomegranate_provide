import UserRegisterForm from '@/components/forms/user-register-form'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import imageUrl from "@/public/images/Logo-white.png";
import Image from "next/image";

const SignUp = () => {
    return (
        <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'absolute right-4 top-4 hidden md:right-8 md:top-8'
                )}
            >
                Login
            </div>
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-[#84012A]" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <div>
                        <Image src={imageUrl} alt={"logo"} height={24} priority />
                    </div>
                </div>
                <div className="flex flex-col gap-5 relative z-20 mt-auto">
                    <h1 className='text-3xl'>
                        Empowering You to Provide Holistic Care
                    </h1>
                    <p className='text-lg'>
                    Deliver seamless, patient-centered healthcare with tools to enhance both physical and mental well-being. Simplify your practice and focus on what matters most—your patients.
                    </p>
                    <footer className="text-sm"></footer>
                </div>
            </div>
            <div className="flex h-full items-center p-4 lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter details below to create your account
                        </p>
                    </div>
                    <UserRegisterForm />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{' '}
                        <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp