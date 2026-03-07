export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-layout min-h-screen flex items-center justify-center">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">{children}</div>
    </main>
  );
}
