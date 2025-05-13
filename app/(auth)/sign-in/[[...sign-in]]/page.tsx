import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return <div className='flex items-center justify-center mt-[50px]'> <SignIn /> </div>


    // return <SignIn afterSignInUrl="/" />;
}

