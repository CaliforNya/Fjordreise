import SearchForm from "@/components/SearchForm";

export default function HomePage() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      />
      <main className="relative z-10 w-full ">
        <div className="content-wrapper page-stack">
          <h1>Search</h1>
          <SearchForm />
        </div>
      </main>
    </>
  );
}
