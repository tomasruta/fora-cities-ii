export default function HeaderMainTitle({ children }: { children?: string }) {
  return (
    <h1 className="mt-3 mb-3 md:mt-0 text-2xl font-extrabold text-gray-800  dark:text-gray-200 md:text-3xl">
      {children}
    </h1>
  );
}
