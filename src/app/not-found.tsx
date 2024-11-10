export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-[#576EB2]">
      <div className="text-center px-8">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/"
          className="px-6 py-3 border border-[#576EB2] text-[#576EB2] rounded hover:bg-[#576EB2] hover:text-black transition duration-300"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
