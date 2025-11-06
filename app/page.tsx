import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          TeachFlow
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Plataforma de Gestão para Professores Autônomos
        </p>
        <div className="flex gap-4 items-center justify-center">
          <Link
            href="/login"
            className="rounded-lg border border-transparent px-5 py-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-primary px-5 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Começar Agora
          </Link>
        </div>
      </div>
    </main>
  );
}
