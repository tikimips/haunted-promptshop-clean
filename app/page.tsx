import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p>
        Go to <Link href="/inspiration" className="underline">Inspiration</Link>.
      </p>
    </div>
  );
}
